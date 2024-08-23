import type { Card } from "@/core";
import { getId } from "@/utils/getId";

export class Player {
  private _id: ReturnType<typeof getId>;
  private _name = "";

  private _cards: [] | [Card, Card, Card] = [];

  constructor(name: string) {
    this._id = getId();
    this._name = name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  receiveCards(cards: [Card, Card, Card]) {
    this._cards = cards;
  }

  get cards() {
    return this._cards;
  }

  takeCard(takenCard: Card) {
    const cardIndex = this.cards.findIndex((card) => card.isEqual(takenCard));
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }
    this._cards.splice(cardIndex, 1);
  }
}
