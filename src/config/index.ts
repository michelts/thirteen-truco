import { Card, Deck } from "@/core";
import { Suit } from "@/types";

export function getDefaultDeck() {
  return new Deck(Array.from(generateDefaultCards()));
}

function* generateDefaultCards() {
  for (const cardNumber of [13, 4, 5, 6, 7, 10, 11, 12, 1, 2, 3]) {
    for (const suit of [Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs]) {
      const mimicable = cardNumber === 13;
      yield new Card(cardNumber, suit, mimicable);
    }
  }
}
