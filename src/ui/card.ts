import { type Card, Suit } from "@/core";

export function renderCard(card: Card) {
  return `
    <span>
      ${cardRepresentation[card.cardNumber] ?? card.cardNumber}
      ${suitRepresentation[card.suit]}
    </span>`;
}

const suitRepresentation = {
  [Suit.Diamonds]: "♦️",
  [Suit.Spades]: "♠️",
  [Suit.Hearts]: "❤️",
  [Suit.Clubs]: "♣️",
};

const cardRepresentation: Record<number, string> = {
  1: "A",
  10: "Q",
  11: "J",
  12: "K",
};
