import type { Card, Deck } from "@/core";
import { Player } from "./player";

class Game {
  private _players: Player[];
  private deck: Deck;
  private _rounds: Round[] = [];

  constructor(players: Player[], pack: Deck) {
    this._players = players;
    this.deck = pack;

    this.deck.shuffle();
    for (const player of this._players) {
      player.receiveCards(pack.getHand());
    }
    this._rounds.push(new Round(this));
  }

  get players() {
    return this._players;
  }

  get rounds() {
    return this._rounds;
  }

  get currentRound() {
    return this._rounds[this._rounds.length - 1];
  }

  dropCard(player: Pick<Player, "id">, card: Card) {
    player.takeCard(card);
    this.currentRound.currentStep.addPlayerCard(player, card);
  }
}

class Round {
  private game: Game;
  private steps: RoundStep[] = [];

  constructor(game: Game) {
    this.game = game;
    this.advanceStep();
  }

  advanceStep() {
    this.steps.push(new RoundStep(this.game));
  }

  getSteps() {
    return this.steps;
  }

  get currentStep() {
    return this.steps[this.steps.length - 1];
  }
}

class RoundStep {
  private game: Game;
  private _cards: Record<Player["id"], Card> = {};

  constructor(game: Game) {
    this.game = game;
  }

  get cards() {
    return Object.values(this._cards);
  }

  addPlayerCard(player: Pick<Player, "id">, card: Card) {
    this._cards[player.id] = card;
  }

  get isDone() {
    return this.cards.length === this.game.players.length;
  }
}

export { Player, Game };
