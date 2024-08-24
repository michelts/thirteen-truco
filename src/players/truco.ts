import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { getId } from "@/utils/getId";

export class TrucoPlayer implements Player {
  private _game: Game;
  private _id: ReturnType<typeof getId>;
  private _name = "";
  private _cards: [] | [Card, Card, Card] = [];

  constructor(game: Game, name: string) {
    this._id = getId();
    this._name = name;
    this._game = game;
    this.receiveCards(this._game.deck.getHand());
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  receiveCards(cards: Card[]) {
    if (cards.length !== 3) {
      throw new Error("receiveCards expects 3 cards");
    }
    this._cards = cards as [Card, Card, Card];
  }

  get cards() {
    return this._cards;
  }

  dropCard(card: Card, isHidden?: boolean) {
    if (this._game.currentPlayer === this) {
      this.takeCard(card);
      this._game.currentRound.currentStep.addPlayerCard(this, card, isHidden);
    } else {
      throw new Error("This is not your turn");
    }
  }

  takeCard(takenCard: Card) {
    const cardIndex = this.cards.findIndex((card) => card.isEqual(takenCard));
    if (cardIndex === -1) {
      throw new Error("Card not found");
    }
    return this._cards.splice(cardIndex, 1);
  }
}
