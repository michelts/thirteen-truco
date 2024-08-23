import type { Card, Deck } from "@/core";
import { Player } from "./player";

class Game {
  private _players: Player[];
  private deck: Deck;
  private rounds: Round[] = [];

  constructor(players: Player[], pack: Deck) {
    this._players = players;
    this.deck = pack;

    this.deck.shuffle();
    for (const player of this._players) {
      player.receiveCards(pack.getHand());
    }
    this.rounds.push(new Round());
  }

  get players() {
    return this._players;
  }

  getRounds() {
    return this.rounds;
  }

  get currentRound() {
    return this.rounds[this.rounds.length - 1];
  }

  dropCard(player: Pick<Player, "id">, card: Card) {
    player.takeCard(card);
    this.currentRound.currentStep.addPlayerCard(player, card);
  }
}

class Round {
  private steps: RoundStep[] = [];

  constructor() {
    this.steps.push(new RoundStep());
  }

  getSteps() {
    return this.steps;
  }

  get currentStep() {
    return this.steps[this.steps.length - 1];
  }
}

class RoundStep {
  private _cards: Record<Player["id"], Card> = {};

  get cards() {
    return Object.values(this._cards);
  }

  addPlayerCard(player: Pick<Player, "id">, card: Card) {
    this._cards[player.id] = card;
  }
}

export { Player, Game };
