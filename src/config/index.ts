import { Card, Deck, Suit } from "@/core";

export const defaultDeck = new Deck(Array.from(generateDefaultCards()));

function* generateDefaultCards() {
  for (const cardNumber of [3, 2, 1, 12, 11, 10, 7, 6, 5, 4]) {
    for (const suit of [Suit.Clubs, Suit.Hearts, Suit.Spades, Suit.Diamonds]) {
      yield new Card(cardNumber, suit);
    }
  }
}
