import type { Card, Deck } from "@/core";
import type { Game, Player, Round, Stake, Step, StepCard } from "@/types";
import type { BestCardsFilterFunc } from "@/types";
import {
  CantRaiseStakesOnCompletedRoundStepError,
  NotYourTurnError,
  PendingStakeRaiseError,
  RoundFullError,
} from "@/utils/errors";
import { filterBestCards as defaultFilterBestCards } from "./filterBestCards";
import { getRoundScore } from "./getRoundScore";
import { getTrumpCards } from "./getTrumpCards";

export class TrucoGame implements Game {
  isDone = false;
  filterBestCards: BestCardsFilterFunc = defaultFilterBestCards;
  deck: Deck;
  private _players: Player[] = [];
  private _rounds: Round[] = [];
  private _currentPlayerIndex = 0;

  constructor(pack: Deck, filterBestCards?: BestCardsFilterFunc) {
    this.deck = pack;
    if (filterBestCards) {
      this.filterBestCards = filterBestCards;
    }
    this._rounds.push(new TrucoRound(this));
  }

  get players() {
    return this._players;
  }

  set players(players) {
    this._players = players;
    this._players.forEach((player, index) => {
      player.teamIndex = (index % 2) as Player["teamIndex"];
    });
    this.distributeCards();
  }

  private distributeCards() {
    this.deck.shuffle();
    this.currentRound.turnedCard = this.deck.getCards(1)[0];
    for (const player of this._players) {
      player.receiveCards(this.deck.getCards(3));
    }
  }

  get currentPlayer() {
    return !this.currentRound.currentStep.isDone
      ? this._players[this._currentPlayerIndex]
      : null;
  }

  continue() {
    if (!this.currentRound.isDone) {
      this.currentRound.continue();
    } else {
      this._rounds.push(new TrucoRound(this));
      this.distributeCards();
    }
  }

  passToNextPlayer() {
    this._currentPlayerIndex++;
    if (this._currentPlayerIndex === this._players.length) {
      this._currentPlayerIndex = 0;
    }
  }

  get rounds() {
    return this._rounds;
  }

  get currentRound() {
    return this._rounds[this._rounds.length - 1];
  }

  get score() {
    let us = 0;
    let them = 0;
    for (const { score } of this._rounds) {
      us += score?.[0] ?? 0;
      them += score?.[1] ?? 0;
    }
    return [us, them] satisfies [number, number];
  }
}

class TrucoRound implements Round {
  turnedCard?: Card;
  game: TrucoGame;
  private _stakes: TrucoStake[] = [];
  private _steps: TrucoRoundStep[] = [];
  private _roundSteps = 3;
  private _defaultStake = { isAccepted: true };

  constructor(game: TrucoGame) {
    this.game = game;
    this.continue();
  }

  continue() {
    if (this._steps.length < this._roundSteps) {
      this._steps.push(new TrucoRoundStep(this));
    } else {
      throw new RoundFullError();
    }
  }

  get steps() {
    return this._steps;
  }

  get currentStep() {
    return this._steps[this._steps.length - 1];
  }

  get isDone() {
    return (
      (this.currentStep.isDone && this.score !== undefined) ||
      this.stake.isAccepted === false
    );
  }

  get trumpCards() {
    if (this.turnedCard) {
      return getTrumpCards(
        this.game.deck.cardsFromLowestToHighest,
        this.turnedCard,
      );
    }
    return [];
  }

  get score() {
    if (this.stake.isAccepted === false) {
      const points = this._prevStake.points ?? 1;
      const score: [number, number] = [
        this.stake.raisedBy.teamIndex === 0 ? points : 0,
        this.stake.raisedBy.teamIndex === 1 ? points : 0,
      ];
      return score;
    }
    const matches = this._steps.map((step) => {
      const match: [number, number] = [0, 0];
      if (step.winner) {
        match[step.winner.teamIndex] += 1;
      }
      return match;
    });
    const score = getRoundScore(
      matches,
      this.stake.points ?? 1,
      this.stake?.raisedBy?.teamIndex,
    );
    if (score[0] === score[1]) {
      return undefined;
    }
    return score;
  }

  get stake() {
    return this._stakes.slice(-1)[0] ?? this._defaultStake;
  }

  private get _prevStake() {
    return this._stakes.slice(0, -1).slice(-1)[0] ?? this._defaultStake;
  }

  raiseStake(player: Player) {
    if (this.stake.isAccepted === undefined) {
      throw new PendingStakeRaiseError();
    }
    if (this.currentStep.isDone) {
      throw new CantRaiseStakesOnCompletedRoundStepError();
    }
    this._stakes.push(new TrucoStake(this, this.nextStakePoints, player));
  }

  get nextStakePoints() {
    return (this.stake?.points ?? 0) + 3;
  }
}

class TrucoStake implements Stake {
  _round: TrucoRound;
  points: number;
  raisedBy: Player;
  acceptedBy: Player[] = [];
  rejectedBy: Player[] = [];

  constructor(round: TrucoRound, points: number, raisedBy: Player) {
    this._round = round;
    this.points = points;
    this.raisedBy = raisedBy;
  }

  get isAccepted() {
    const expectedApprovals = this._round.game.players.filter(
      (player) => player.teamIndex !== this.raisedBy.teamIndex,
    );
    const acceptedIds = this.acceptedBy.map((player) => player.id);
    const rejectedIds = this.rejectedBy.map((player) => player.id);
    for (const player of expectedApprovals) {
      if (rejectedIds.includes(player.id)) {
        return false;
      }
      if (!acceptedIds.includes(player.id)) {
        return undefined;
      }
    }
    return true;
  }

  accept(player: Player) {
    if (player.teamIndex === this.raisedBy.teamIndex) {
      throw new NotYourTurnError();
    }
    this.acceptedBy.push(player);
  }

  reject(player: Player) {
    if (player.teamIndex === this.raisedBy.teamIndex) {
      throw new NotYourTurnError();
    }
    this.rejectedBy.push(player);
  }
}

class TrucoRoundStep implements Step {
  private _round: TrucoRound;
  private _cards: TrucoStepCard[] = [];

  constructor(round: TrucoRound) {
    this._round = round;
  }

  get cards() {
    return Object.values(this._cards);
  }

  addPlayerCard(player: Player, card: Card, isHidden?: boolean) {
    this._cards.push(new TrucoStepCard(this, player, card, isHidden ?? false));
    this._round.game.passToNextPlayer();
  }

  get isDone() {
    return this.cards.length === this._round.game.players.length;
  }

  get bestCards() {
    const trumpCardNumber = this._round.trumpCards[0]?.cardNumber;
    if (!this.isDone || !trumpCardNumber) {
      return [];
    }
    return this._round.game.filterBestCards(
      this.cards
        .filter((stepCard) => !stepCard.isHidden)
        .map((stepCard) => stepCard.card),
      this._round.game.deck.cardsFromLowestToHighest,
      trumpCardNumber,
    );
  }

  get winner() {
    const winners = this.bestCards.map((bestCard) => {
      return this.cards.find((item) => item.card.isEqual(bestCard));
    });
    if (winners.length > 1) {
      return undefined;
    }
    return winners[0]?.player ?? undefined;
  }
}

class TrucoStepCard implements StepCard {
  private _step: TrucoRoundStep;
  player: Player;
  card: Card;
  isHidden: boolean;

  constructor(
    step: TrucoRoundStep,
    player: Player,
    card: Card,
    isHidden: boolean,
  ) {
    this._step = step;
    this.player = player;
    this.card = card;
    this.isHidden = isHidden;
  }

  get isBest() {
    return this._step.bestCards.some((card) => card.isEqual(this.card));
  }
}
