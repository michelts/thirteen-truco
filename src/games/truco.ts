import type { Card, Deck } from "@/core";
import type { Game, Player, Round, Step, StepCard } from "@/types";

export class TrucoGame implements Game {
  deck: Deck;
  private _players: Player[] = [];
  private _rounds: Round[] = [];
  private _currentPlayerIndex = 0;

  constructor(pack: Deck) {
    this.deck = pack;
    this.deck.shuffle();
    this._rounds.push(new TrucoRound(this));
  }

  get players() {
    return this._players;
  }

  get currentPlayer() {
    return !this.currentRound.currentStep.isDone
      ? this._players[this._currentPlayerIndex]
      : null;
  }

  passToNextPlayer() {
    this._currentPlayerIndex++;
    if (this._currentPlayerIndex === this._players.length) {
      this._currentPlayerIndex = 0;
    }
  }

  set players(players) {
    this._players = players;
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

  constructor(game: TrucoGame) {
    this.game = game;
    this.advanceStep();
  }

  advanceStep() {
    this._steps.push(new TrucoRoundStep(this.game));
  }

  get steps() {
    return this._steps;
  }

  get currentStep() {
    return this._steps[this._steps.length - 1];
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
}
