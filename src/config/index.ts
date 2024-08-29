import { Card, Deck, Suit } from "@/core";

export function getDefaultDeck() {
  return new Deck(Array.from(generateDefaultCards()));
}

function* generateDefaultCards() {
  for (const cardNumber of [4, 5, 6, 7, 10, 11, 12, 1, 2, 3]) {
    for (const suit of [Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs]) {
      yield new Card(cardNumber, suit);
    }
  }
}
