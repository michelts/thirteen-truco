import { RoundFullError } from "@/utils/errors";
import type { Card, Deck } from "@/core";
import type { Game, Player, Round, Step, StepCard } from "@/types";

type StepComparerFunc = (cards: Card[]) => Card[];

const defaultStepComparer: StepComparerFunc = (cards) => {
  return cards.slice(0, 1);
};

export class TrucoGame implements Game {
  isDone = false;
  stepComparer: StepComparerFunc = defaultStepComparer;
  private _deck: Deck;
  private _players: Player[] = [];
  private _rounds: Round[] = [];
  private _currentPlayerIndex = 0;

  constructor(pack: Deck, stepComparer?: StepComparerFunc) {
    this._deck = pack;
    this._deck.shuffle();
    if (stepComparer) {
      this.stepComparer = stepComparer;
    }
    this._rounds.push(new TrucoRound(this));
  }

  get players() {
    return this._players;
  }

  set players(players) {
    this._players = players;
    this.distributeCards();
  }

  private distributeCards() {
    for (const player of this._players) {
      player.receiveCards(this._deck.getHand());
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
}

class TrucoRound implements Round {
  game: TrucoGame;
  private _steps: TrucoRoundStep[] = [];
  private _roundSteps = 3;

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
    return this._steps.length === 3 && this.currentStep.isDone;
  }
}

interface TrucoStep {
  bestCards: Card[];
}

class TrucoRoundStep implements Step, TrucoStep {
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
    if (!this.isDone) {
      return [];
    }
    return this._round.game.stepComparer(
      this.cards.map((stepCard) => stepCard.card),
    );
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
