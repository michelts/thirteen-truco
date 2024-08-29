import { NotEnoughCardsError } from "@/utils/errors";
import { shuffle } from "@/utils/shuffle";

export enum Suit {
  Diamonds = 1,
  Spades = 2,
  Hearts = 3,
  Clubs = 4,
}

export class Deck {
  cards: [] | Card[] = [];
  shuffledCards: [] | Card[] = [];
  shuffleFunc: (cards: Card[]) => Card[] = shuffle;

  constructor(cards: Card[], shuffleFunc?: (cards: Card[]) => Card[]) {
    console.log(
      "XXX1",
      cards.map((c) => String(c)),
    );
    this.cards = cards;
    if (shuffleFunc) {
      this.shuffleFunc = shuffleFunc;
    }
  }

  shuffle() {
    this.shuffledCards = this.shuffleFunc(this.cardsFromLowestToHighest);
  }

  getCards(count: number): Card[] {
    const cards = this.shuffledCards.splice(0, count);
    if (cards.length !== count) {
      throw new NotEnoughCardsError();
    }
    return cards;
  }
}

export class Card {
  public cardNumber: number;
  public suit: Suit;

  constructor(cardNumber: number, suit: Suit) {
    this.cardNumber = cardNumber;
    this.suit = suit;
  }

  isEqual(card: Card) {
    return this.cardNumber === card.cardNumber && this.suit === card.suit;
  }

  toString() {
    return `${this.cardNumber}s${this.suit}`;
  }
}
