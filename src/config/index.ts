import { Card, Deck } from "@/core";

export const defaultDeck = new Deck(Array.from(generateDefaultCards()));

function* generateDefaultCards() {
  for (const cardNumber of range(13)) {
    for (const suit of range(4)) {
      yield new Card(cardNumber, suit);
    }
  }
}

function* range(count: number) {
  let currentIndex = 1;
  while (currentIndex <= count) {
    yield currentIndex;
    currentIndex++;
  }
}
