import type {
  Card,
  Deck,
  Game,
  Player,
  Round,
  Stake,
  Step,
  StepCard,
} from "@/types";
import type { BestCardsFilterFunc } from "@/types";
import {
  CantRaiseStakesOnCompletedRoundStepError,
  GameFinishedError,
  NotYourTurnError,
  PendingStakeRaiseError,
  RoundFullError,
} from "@/utils/errors";
import { filterBestCards as defaultFilterBestCards } from "./filterBestCards";
import { getRoundScore } from "./getRoundScore";
import { getTrumpCards } from "./getTrumpCards";
import { TrucoPlayerCard } from "./player";

export class TrucoGame implements Game {
  filterBestCards: BestCardsFilterFunc = defaultFilterBestCards;
  deck: Deck;
  private _players: Player[] = [];
  private _rounds: Round[] = [];

  constructor(pack: Deck, filterBestCards?: BestCardsFilterFunc) {
    this.deck = pack;
    if (filterBestCards) {
      this.filterBestCards = filterBestCards;
    }
  }

  get players() {
    return this._players;
  }

  set players(players) {
    this._players = players;
    this._players.forEach((player, index) => {
      player.teamIndex = (index % 2) as Player["teamIndex"];
    });
    this._rounds.push(new TrucoRound(this, players[0]));
    this.distributeCards();
  }

  private distributeCards() {
    this.deck.shuffle();
    while (this.currentRound.turnedCard?.mimicable !== false) {
      this.currentRound.turnedCard = this.deck.getCard();
    }
    for (const player of this._players) {
      const cards = [];
      while (cards.length < 3) {
        const card = this.deck.getCard();
        let realCard: Card | undefined = undefined;
        if (card.mimicable) {
          while (realCard?.mimicable !== false) {
            realCard = this.deck.getCard();
          }
        }
        cards.push(new TrucoPlayerCard(card, realCard));
      }
      player.receiveCards(cards);
    }
  }

  continue() {
    if (this.isDone) {
      throw new GameFinishedError();
    }
    if (!this.currentRound.isDone) {
      this.currentRound.continue();
    } else {
      const nextPlayer = findNextPlayer(
        this.players,
        this.currentRound.initialPlayer,
      );
      this._rounds.push(new TrucoRound(this, nextPlayer));
      this.distributeCards();
    }
  }

  reset(players?: Player[]) {
    if (players) {
      this._players = players;
      this._players.forEach((player, index) => {
        player.teamIndex = (index % 2) as Player["teamIndex"];
      });
    }
    this._rounds = [];
    this._rounds.push(new TrucoRound(this, this.players[0]));
    this.distributeCards();
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
    return [this.capMaxScore(us), this.capMaxScore(them)] satisfies [
      number,
      number,
    ];
  }

  capMaxScore(value: number) {
    return value <= 12 ? value : 12;
  }

  get isDone() {
    return this.score.some((value) => value === 12);
  }
}

class TrucoRound implements Round {
  turnedCard?: Card;
  game: TrucoGame;
  initialPlayer: Player;
  private _stakes: TrucoStake[] = [];
  private _steps: TrucoRoundStep[] = [];
  private _roundSteps = 3;
  private _defaultStake = { isAccepted: true };

  constructor(game: TrucoGame, initialPlayer?: Player) {
    this.game = game;
    this.continue();
    this.initialPlayer = initialPlayer ?? game.players[0];
  }

  get currentPlayer() {
    if (this.currentStep.isDone) {
      return null;
    }
    if (!this.currentStep.cards.length) {
      return this._latestStep?.winner ?? this.initialPlayer;
    }
    const latestPlayer = this.currentStep.cards.slice(-1)[0].player;
    return findNextPlayer(this.game.players, latestPlayer);
  }

  continue() {
    if (this.game.isDone) {
      throw new GameFinishedError();
    }
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

  private get _latestStep() {
    return this._steps[this._steps.length - 2];
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
        this.game.deck.cardsFromLowestToHighest.filter(
          (card) => !card.mimicable,
        ),
        this.turnedCard,
      );
    }
    return [];
  }

  get score() {
    const validSteps = this._steps.filter((step) => step.isDone);
    if (this.stake.isAccepted === false) {
      const points = this.previousStakePoints;
      const score: [number, number] = [
        this.stake.raisedBy.teamIndex === 0 ? points : 0,
        this.stake.raisedBy.teamIndex === 1 ? points : 0,
      ];
      return score;
    }
    const matches = validSteps.map((step) => {
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
    return score;
  }

  get stake() {
    return this._stakes.slice(-1)[0] ?? this._defaultStake;
  }

  get previousStakePoints() {
    const stake = this._stakes.slice(0, -1).slice(-1)[0] ?? this._defaultStake;
    return stake.points ?? 1;
  }

  get currentStakePoints() {
    const stake = this._stakes.slice(-1)[0] ?? this._defaultStake;
    return stake.points ?? 1;
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

function findNextPlayer(players: Player[], currentPlayer: Player) {
  const previousIndex = players.findIndex((player) =>
    player.isEqual(currentPlayer),
  );
  return players[(previousIndex + 1) % players.length];
}
