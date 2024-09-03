import type { BestCardsFilterFunc, Card } from "@/types";

export const filterBestCards: BestCardsFilterFunc = (
  testedCards,
  cardsFromLowestToHighest,
  trumpCardNumber,
) => {
  const candidates = cardsFromLowestToHighest
    .filter((card) =>
      testedCards.some((testedCard) => testedCard.isEqual(card)),
    )
    .reverse();
  return getHighestAccountingDrawsAndTrump(candidates, trumpCardNumber);
};

function getHighestAccountingDrawsAndTrump(
  candidates: Card[],
  trumpCardNumber: number,
) {
  if (!candidates.length) {
    return []; // XXX
  }
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
