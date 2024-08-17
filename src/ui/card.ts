import { type Card, Suit } from "@/core";

export function renderCard(card: Card) {
  return `<span>${card.cardNumber} ${suitRepresentation[card.suit]}</span>`;
}

const suitRepresentation = {
  [Suit.Diamonds]: "♦️",
  [Suit.Spades]: "♠️",
  [Suit.Hearts]: "❤️",
  [Suit.Clubs]: "♣️",
};
