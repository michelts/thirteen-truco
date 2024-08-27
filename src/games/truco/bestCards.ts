import type { BestCardsFilterFunc } from "@/types";

export const filterTrucoBestCards: BestCardsFilterFunc = (cards, deck) => {
  const cardsFromHighestToLowest = deck.cards;
  const candidates = cardsFromHighestToLowest.filter((deckCard) =>
    cards.some((card) => card.isEqual(deckCard)),
  );
  return Array.from(getHighestAccountingDraws(candidates));
};

function* getHighestAccountingDraws(candidates: Card[]) {
  let previousCardNumber = null;
  for (const card of candidates) {
    if (previousCardNumber === null) {
      yield card;
    } else if (card.cardNumber === previousCardNumber) {
      yield card;
    } else {
      return;
    }
    previousCardNumber = card.cardNumber;
  }
}
