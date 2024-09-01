import type { Card } from "@/core";
import { shuffle } from "@/utils/shuffle";
import { EmptyHandError } from "@/utils/errors";
import type { Player } from "@/types";

export const autoPickCard = (...args: Parameters<typeof _autoPickCard>) => {
  const output = _autoPickCard(...args);
  const hand = args[0];
  return { ...output, card: output.card ?? hand[0] };
};

const _autoPickCard = (
  hand: Card[],
  previousFromOurs: Card[][],
  previousFromTheirs: Card[][],
  trumpCardsFromLowestToHighest: Card[],
  cardsFromLowestToHighest: Card[],
): ReturnType<Player["autoPickCard"]> => {
  const cardsHeights = Object.fromEntries(
    cardsFromLowestToHighest.map((card, index) => [
      card.toString(),
      index +
        (card.cardNumber === trumpCardsFromLowestToHighest[0].cardNumber
          ? 100
          : 0),
    ]),
  );
  const myTrumpsRaw = getMyTrumpCard(hand, trumpCardsFromLowestToHighest);
  const [diamondsTrump, spadesTrump, heartsTrump, clubsTrump] = myTrumpsRaw;
  const myTrumps = myTrumpsRaw.filter(
    (card: Card | undefined): card is Card => card !== undefined,
  );
  const topCardsAreTrump =
    cardsFromLowestToHighest.slice(-1)[0].cardNumber ===
    trumpCardsFromLowestToHighest[0].cardNumber;
  const topCards = topCardsAreTrump
    ? cardsFromLowestToHighest.slice(-12, -4)
    : cardsFromLowestToHighest.slice(-8);
  const myTopCards = topCards
    .filter((card) => hand.some((handCard) => handCard.isEqual(card)))
    .reverse();
  const myLowerCards = cardsFromLowestToHighest.filter(
    (card) =>
      hand.some((handCard) => handCard.isEqual(card)) &&
      !trumpCardsFromLowestToHighest.some((trumpCard) =>
        trumpCard.isEqual(card),
      ) &&
      !myTopCards.some((topCard) => topCard.isEqual(card)),
  );
  const step = hand.length - 2;
  const partnerCard = previousFromOurs.slice(-1)[0][0];
  const isPartnerCardTop =
    partnerCard &&
    [...topCards, ...trumpCardsFromLowestToHighest].some((card) =>
      card.isEqual(partnerCard),
    );
  const isHead = partnerCard === undefined;
  const enemyCards = previousFromTheirs.slice(-1)[0];
  const isEnemyCardsTop = enemyCards.some((enemyCard) =>
    [...topCards, ...trumpCardsFromLowestToHighest].some((card) =>
      card.isEqual(enemyCard),
    ),
  );

  console.log({
    trumps: myTrumps.map((card) => card.toString()),
    myTopCards: myTopCards.map((card) => card.toString()),
    myLowerCards: myLowerCards.map((card) => card.toString()),
    previousFromOurs: previousFromOurs.map((card) => card.toString()),
    previousFromTheirs: previousFromTheirs.map((card) => card.toString()),
    step,
    isHead,
    enemyCards: enemyCards.map((card) => card.toString()),
    isEnemyCardsTop,
  });

  if (step === 1 && myTrumps && isEnemyCardsTop) {
    console.log("First step with trumps against enemy top cards");
    for (const myCard of myTrumps) {
      console.log("mycard", { height: cardsHeights[myCard.toString()] });
      const willCardWin = enemyCards.every((enemyCard) => {
        console.log("enemy", { height: cardsHeights[enemyCard.toString()] });
        return (
          cardsHeights[myCard.toString()] > cardsHeights[enemyCard.toString()]
        );
      });
      if (willCardWin) {
        return { card: myCard, isHidden: false, shouldRaise: true };
      }
      return {
        card: myLowerCards[0] ?? myTopCards[0],
        isHidden: false,
        shouldRaise: false,
      };
    }
  }
  if (step === 1 && partnerCard && isPartnerCardTop) {
    console.log(
      "Lower card as my partner already put a higher card to help my highest card of the game",
    );
    return { card: myLowerCards[0], isHidden: false, shouldRaise: false };
  }

  if (step === 1 && clubsTrump) {
    if (isHead && topCards.length) {
      console.log("Higher card to help my highest card of the game");
      return { card: myTopCards[0], isHidden: false, shouldRaise: false };
    }

    if (heartsTrump) {
      console.log(
        "Lowest card for higher couple, or the hearts trump if no lower card",
      );
      return {
        card: myLowerCards[0] ?? heartsTrump,
        isHidden: false,
        shouldRaise: false,
      };
    }
  }

  if (diamondsTrump || spadesTrump || heartsTrump) {
    console.log("One of the lower best trumps on any step");
    return {
      card: (diamondsTrump || spadesTrump || heartsTrump) as Card,
      isHidden: false,
      shouldRaise: false,
    };
  }

  if (step === 1) {
    if (isHead && myLowerCards[0]) {
      console.log("Lowest card because I'm head");
      return {
        card: myLowerCards[0],
        isHidden: false,
        shouldRaise: false,
      };
    }

    console.log("Highest card because I'm tail");
    if (!isHead && myTopCards[0]) {
      return {
        card: myTopCards[0],
        isHidden: false,
        shouldRaise: false,
      };
    }
  }

  console.log("Random card as fallback");
  const fallback = shuffle(hand)[0];
  if (!fallback) {
    throw new EmptyHandError();
  }
  return { card: fallback, isHidden: false, shouldRaise: false };
};

function getMyTrumpCard(hand: Card[], trumpCardsFromLowestToHighest: Card[]) {
  return trumpCardsFromLowestToHighest.map((trumpCard) =>
    hand.find((card) => card.isEqual(trumpCard)),
  );
}
