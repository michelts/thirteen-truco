import type { Card } from "@/core";
import { getId } from "@/utils/getId";

export class Player {
  private _id: ReturnType<typeof getId>;
  private name = "";

  private cards: [] | [Card, Card, Card] = [];

  constructor(name: string) {
    this._id = getId();
    this.name = name;
  }

  get id() {
    return this._id;
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

  takeCard(takenCard: Card) {
    const cardIndex = this.cards.findIndex((card) => card.isEqual(takenCard));
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }
    const [card] = this.cards.splice(cardIndex, 1);
    return card;
  }
}
