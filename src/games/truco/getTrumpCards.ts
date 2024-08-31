import type { Card } from "@/core";
import { CardNotFoundError } from "@/utils/errors";

export const getTrumpCards = (
  cardsFromLowestToHighest: Card[],
  turnedCard: Card,
) => {
  return Array.from(
    generateTrumpCards(cardsFromLowestToHighest, turnedCard),
  ).reverse();
};

function* generateTrumpCards(
  cardsFromLowestToHighest: Card[],
  turnedCard: Card,
) {
  let turnedCardNumber = null;
  let trumpCardNumber = null;
  const chainedCardsFromLowestToHighest = [
    ...cardsFromLowestToHighest,
    ...cardsFromLowestToHighest,
  ];
  for (const card of chainedCardsFromLowestToHighest) {
    if (card.isEqual(turnedCard)) {
      turnedCardNumber = card.cardNumber;
      continue;
    }
    if (trumpCardNumber && card.cardNumber !== trumpCardNumber) {
      return;
    }
    if (turnedCardNumber && card.cardNumber !== turnedCardNumber) {
      trumpCardNumber = card.cardNumber;
      yield card;
    }
  }
  throw new CardNotFoundError();
}
