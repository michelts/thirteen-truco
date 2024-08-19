import { type Card, Suit } from "@/core";

export function renderCard(card: Card) {
  const number = `<div class="n">${cardRepresentation[card.cardNumber] ?? card.cardNumber}</div>`;
  const suit = `<div class="r">${suitRepresentation[card.suit]}</div>`;
  return `
    <div class="card card-${card.suit}">
      ${number}
      ${suit}
      ${number}
    </div>`;
}

const suitRepresentation = {
  [Suit.Diamonds]: "♦️",
  [Suit.Spades]: "♠️",
  [Suit.Hearts]: "♥",
  [Suit.Clubs]: "♣️",
};

const cardRepresentation: Record<number, string> = {
  1: "A",
  10: "Q",
  11: "J",
  12: "K",
};
