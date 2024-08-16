import type { Card, Deck } from "@/core";

class Game {
  private players: Player[];
  private deck: Deck;
  private roundCards?: Card[];

  constructor(players: Player[], pack: Deck) {
    this.players = players;
    this.deck = pack;

    this.deck.shuffle();
    for (const player of this.players) {
      player.receiveCards(pack.getHand());
    }
  }

  getPlayers() {
    return this.players;
  }

  getRoundCards() {
    return this.roundCards;
  }
}

class Player {
  private name = "";
  private cards: [] | [Card, Card, Card] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  receiveCards(cards: [Card, Card, Card]) {
    this.cards = cards;
  }

  getCards() {
    return this.cards;
  }
}

export { Player, Game };
