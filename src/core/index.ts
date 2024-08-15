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
  shuffleFunc: (cards: Card[]) => void = shuffle;

  constructor(cards: Card[], shuffleFunc: (cards: Card[]) => void) {
    this.cards = cards;
    this.shuffleFunc = shuffleFunc;
    this.shuffle();
  }

  shuffle() {
    this.shuffledCards = [...this.cards];
    this.shuffleFunc(this.shuffledCards);
  }

  getHand(): [Card, Card, Card] {
    const cards = this.shuffledCards.splice(0, 3);
    if (!hasEnoughCards(cards)) {
      throw Error("Not enough cards");
    }
    return cards;
  }

  getTrump(): Card {
    const card = this.shuffledCards.shift();
    if (!card) {
      throw Error("Not enough cards");
    }
    return card;
  }
}

function hasEnoughCards<T>(cards: T[]): cards is [T, T, T] {
  return cards.length === 3;
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
}
