import type { Card, Deck } from "@/core";
import type { Game, Player, Round, Step } from "@/types";

export class TrucoGame implements Game {
  deck: Deck;
  private _players: Player[] = [];
  private _rounds: Round[] = [];

  constructor(pack: Deck) {
    this.deck = pack;
    this.deck.shuffle();
    this._rounds.push(new TrucoRound(this));
  }

  get players() {
    return this._players;
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
  private game: TrucoGame;
  private _cards: Record<Player["id"], Card> = {};

  constructor(game: TrucoGame) {
    this.game = game;
  }

  get cards() {
    return Object.values(this._cards);
  }

  addPlayerCard(player: Pick<Player, "id">, card: Card) {
    if (!this._cards[player.id]) {
      this._cards[player.id] = card;
    } else {
      throw new Error("Cant add card twice");
    }
  }

  get isDone() {
    return this.cards.length === this.game.players.length;
  }
}
