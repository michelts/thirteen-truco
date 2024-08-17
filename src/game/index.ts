import type { Card, Deck } from "@/core";
import { Player } from "./player";

class Game {
  private players: Player[];
  private deck: Deck;
  private rounds: Round[] = [];

  constructor(players: Player[], pack: Deck) {
    this.players = players;
    this.deck = pack;

    this.deck.shuffle();
    for (const player of this.players) {
      player.receiveCards(pack.getHand());
    }
    this.rounds.push(new Round());
  }

  getPlayers() {
    return this.players;
  }

  getRounds() {
    return this.rounds;
  }

  getCurrentRound() {
    return this.rounds[this.rounds.length - 1];
  }

  dropCard(player: Player, card: Card) {
    player.takeCard(card);
    this.getCurrentRound().getCurrentStep().addPlayerCard(player, card);
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

  getCurrentStep() {
    return this.steps[this.steps.length - 1];
  }
}

class RoundStep {
  private cards: Record<Player["id"], Card> = {};

  getCards() {
    return Object.values(this.cards);
  }

  addPlayerCard(player: Player, card: Card) {
    this.cards[player.id] = card;
  }
}

export { Player, Game };
