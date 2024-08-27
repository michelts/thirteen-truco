import { RoundFullError } from "@/utils/errors";
import type { Card, Deck } from "@/core";
import type { Game, Player, Round, Step, StepCard } from "@/types";

export class TrucoGame implements Game {
  isDone = false;
  private _deck: Deck;
  private _players: Player[] = [];
  private _rounds: Round[] = [];
  private _currentPlayerIndex = 0;

  constructor(pack: Deck) {
    this._deck = pack;
    this._deck.shuffle();
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
  private game: TrucoGame;
  private _steps: TrucoRoundStep[] = [];
  private _roundSteps = 3;

  constructor(game: TrucoGame) {
    this.game = game;
    this.continue();
  }

  continue() {
    if (this._steps.length < this._roundSteps) {
      this._steps.push(new TrucoRoundStep(this.game));
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

class TrucoRoundStep implements Step {
  private _game: TrucoGame;
  private _cards: TrucoStepCard[] = [];

  constructor(game: TrucoGame) {
    this._game = game;
  }

  get cards() {
    return Object.values(this._cards);
  }

  addPlayerCard(player: Player, card: Card, isHidden?: boolean) {
    this._cards.push(new TrucoStepCard(player, card, isHidden ?? false));
    this._game.passToNextPlayer();
  }

  get isDone() {
    return this.cards.length === this._game.players.length;
  }
}

class TrucoStepCard implements StepCard {
  player: Player;
  card: Card;
  isHidden: boolean;

  constructor(player: Player, card: Card, isHidden: boolean) {
    this.player = player;
    this.card = card;
    this.isHidden = isHidden;
  }

  get isBest() {
    return false;
  }
}
