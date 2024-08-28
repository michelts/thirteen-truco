import type { Card } from "@/core";
import type { BestCardsFilterFunc } from "@/types";
import { CardNotFoundError } from "@/utils/errors";

export const filterTrucoBestCards: BestCardsFilterFunc = (
  testedCards,
  cardsFromHighestToLowest,
  turnedCard,
) => {
  const candidates = cardsFromHighestToLowest.filter((card) =>
    testedCards.some((testedCard) => testedCard.isEqual(card)),
  );
  const trumpCardNumber = getTrumpCardNumber(
    cardsFromHighestToLowest,
    turnedCard,
  );
  return getHighestAccountingDrawsAndTrump(candidates, trumpCardNumber);
};

function getTrumpCardNumber(
  cardsFromHighestToLowest: Card[],
  turnedCard: Card,
) {
  const cardsFromLowestToHighest = [...cardsFromHighestToLowest].reverse();
  let turnedCardNumber = null;
  for (const card of cardsFromLowestToHighest) {
    console.log({ card: card.toString(), turnedCardNumber });
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
  console.log({
    candidates: candidates.map((x) => x.toString()),
    trumpCardNumber,
  });
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
