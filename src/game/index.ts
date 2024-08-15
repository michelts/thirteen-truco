import type { Card, Deck } from "@/core";

class Game {
  private players?: [Player, Player];
  private deck?: Deck;

  constructor(players: [Player, Player], pack: Deck) {
    this.players = players;
    this.deck = pack;

    this.deck.shuffle();
    for (const player of this.players) {
      player.receiveCards(pack.getHand());
    }
  }
}

class Player {
  private cards: [] | [Card, Card, Card] = [];

  receiveCards(cards: [Card, Card, Card]) {
    this.cards = cards;
  }

  getCards() {
    return this.cards;
  }
}

export { Player, Game };
