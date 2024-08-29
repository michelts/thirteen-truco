import type { Card } from "@/core";
import type { BestCardsFilterFunc } from "@/types";
import { CardNotFoundError } from "@/utils/errors";

export const filterTrucoBestCards: BestCardsFilterFunc = (
  testedCards,
  cardsFromLowestToHighest,
  turnedCard,
) => {
  const candidates = cardsFromLowestToHighest
    .filter((card) =>
      testedCards.some((testedCard) => testedCard.isEqual(card)),
    )
    .reverse();
  const trumpCardNumber = getTrumpCardNumber(
    cardsFromLowestToHighest,
    turnedCard,
  );
  return getHighestAccountingDrawsAndTrump(candidates, trumpCardNumber);
};

function getTrumpCardNumber(
  cardsFromLowestToHighest: Card[],
  turnedCard: Card,
) {
  let turnedCardNumber = null;
  for (const card of cardsFromLowestToHighest) {
    if (card.isEqual(turnedCard)) {
      turnedCardNumber = card.cardNumber;
    }
    if (turnedCardNumber && card.cardNumber !== turnedCardNumber) {
      return card.cardNumber;
    }
  }
  if (turnedCardNumber) {
    const firstCardNumberAgain = cardsFromLowestToHighest[0].cardNumber;
    return firstCardNumberAgain;
  }
  throw new CardNotFoundError();
}

function getHighestAccountingDrawsAndTrump(
  candidates: Card[],
  trumpCardNumber: number,
) {
  const highestCards = [];
  const highestCardNumber = candidates[0].cardNumber;
  for (const card of candidates) {
    if (card.cardNumber === trumpCardNumber) {
      return [card];
    }
    if (card.cardNumber === highestCardNumber) {
      highestCards.push(card);
    }
  }
  return highestCards;
}
