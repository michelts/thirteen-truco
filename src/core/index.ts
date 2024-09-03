import type { Card as CardType, Deck as DeckType, Suit } from "@/types";
import { NotEnoughCardsError } from "@/utils/errors";
import { shuffle } from "@/utils/shuffle";

export class Card implements CardType {
  cardNumber: number;
  suit: Suit;
  mimicable: boolean;

  constructor(cardNumber: number, suit: Suit, mimicable = false) {
    this.cardNumber = cardNumber;
    this.suit = suit;
    this.mimicable = mimicable;
  }

  toString() {
    return `${this.cardNumber}s${this.suit}`;
  }

  isEqual(card: Card) {
    return this.cardNumber === card.cardNumber && this.suit === card.suit;
  }
}

export class Deck implements DeckType {
  cardsFromLowestToHighest: [] | Card[] = [];
  shuffledCards: [] | Card[] = [];
  shuffleFunc: (cards: Card[]) => Card[] = shuffle;

  constructor(
    cardsFromLowestToHighest: Card[],
    shuffleFunc?: (cards: Card[]) => Card[],
  ) {
    this.cardsFromLowestToHighest = cardsFromLowestToHighest;
    if (shuffleFunc) {
      this.shuffleFunc = shuffleFunc;
    }
  }

  shuffle() {
    this.shuffledCards = this.shuffleFunc(this.cardsFromLowestToHighest);
  }

  getCard(): Card {
    const card = this.shuffledCards.shift();
    if (!card) {
      throw new NotEnoughCardsError();
    }
    return card;
  }
}
