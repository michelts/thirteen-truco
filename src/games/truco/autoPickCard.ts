import { Card as CardImplementation } from "@/core";
import type { Card } from "@/types";
import { shuffle } from "@/utils/shuffle";

type AutoPickCardFunc = (
  hand: Card[],
  previousFromUs: Card[][],
  previousFromThem: Card[][],
  wins: (boolean | undefined)[],
  trumpCards: Card[],
  cardsFromLowestToHighest: Card[],
  getRaiseByLevel?: (level: number) => boolean,
) => {
  card: Card;
  isHidden: boolean;
  shouldRaise: boolean;
};

export const autoPickCard: AutoPickCardFunc = (...args) => {
  const picker = new CardPicker(...args);
  return picker.pick();
};

interface CardPickerInterface {
  pick: () => ReturnType<AutoPickCardFunc>;
}

interface CardWithHeights extends Card {
  height: number;
  groupHeight: number;
}

enum CardAction {
  Raise3 = 3,
  Raise2 = 2,
  Raise1 = 1,
  DoNotRaise = 0,
  Discard = -1,
}

class CardPicker implements CardPickerInterface {
  _allCards: CardWithHeights[];
  _myHandAscending: CardWithHeights[];
  _trumpCards: CardWithHeights[];
  _previousFromUs: CardWithHeights[][];
  _previousFromThem: CardWithHeights[][];
  _myTopCards: CardWithHeights[];
  _wins: (boolean | undefined)[];
  _getRaiseByLevel: typeof defaultGetRaiseByLevel;

  constructor(...args: Parameters<AutoPickCardFunc>) {
    const [
      hand,
      previousFromUs,
      previousFromThem,
      wins,
      trumpCards,
      cardsFromLowestToHighest,
      getRaiseByLevel,
    ] = args;
    const result = getCardsWithHeights(
      cardsFromLowestToHighest,
      trumpCards[0].cardNumber,
      hand,
      previousFromUs,
      previousFromThem,
    );
    this._allCards = result[0];
    this._trumpCards = result[1];
    this._myHandAscending = result[2].sort((a, b) => a.height - b.height);
    this._previousFromUs = result[3];
    this._previousFromThem = result[4];
    this._myTopCards = this._filterTopCards(this._myHandAscending);
    this._wins = wins;
    this._getRaiseByLevel = getRaiseByLevel ?? defaultGetRaiseByLevel;
  }

  pick() {
    if (this._round === 1) {
      if (this._isMyPartnerWinningWithTopCard()) {
        return makePickReturn(this._pickWorstCard());
      }
      if (this._myTrumpCards.length === 0) {
        const cardToWinStep = this.getCardToWinStep(this._myHandAscending);
        if (cardToWinStep) {
          return makePickReturn(this._dontBurnCard(cardToWinStep));
        }
        if (this._willILoseAnyway) {
          return makePickReturn(this._pickWorstCard());
        }
      }
      const bestCard = this._pickBestFirstCard();
      return makePickReturn(this._dontBurnCard(bestCard));
    }
    if (this._round === 2) {
      if (this._willILoseAnyway) {
        return makePickReturn(this._pickWorstCard(), true, false);
      }
      const cardToWinStep = this.getCardToWinStep(this._myHandAscending);
      if (this._wins[0] && cardToWinStep) {
        return makePickReturn(cardToWinStep, false, true);
      }
      const [bestCard, action] = this._pickBestSecondCard();
      const card = this._dontBurnCard(bestCard);
      if (!card.isEqual(bestCard)) {
        return makePickReturn(card);
      }
      return makePickReturn(
        bestCard,
        action < 0,
        this._getRaiseByLevel(action),
      );
    }
    if (this._round === 3) {
      const cardToWinStep = this.getCardToWinStep(this._myHandAscending);
      if (this._wins[0] && cardToWinStep) {
        return makePickReturn(cardToWinStep, false, true);
      }
      const cardLeft = this._myHandAscending[0];
      if (this._haveMinTrumps(1)) {
        return makePickReturn(
          cardLeft,
          false,
          this._getRaiseByLevel(
            this._wins[0] ? CardAction.Raise2 : CardAction.Raise1,
          ),
        );
      }
      if (this._myTopCards.length > 0) {
        return makePickReturn(
          cardLeft,
          false,
          this._wins[0] ? this._getRaiseByLevel(CardAction.Raise2) : false,
        );
      }
    }
    return makePickReturn(shuffle(this._myHandAscending)[0], false, false);
  }

  _filterTopCards(cards: CardWithHeights[]) {
    const topLimit = this._allCards.length;
    const lowerLimit = this._topCardThreshold;
    return cards.filter((card) => {
      return card.height < topLimit && card.height > lowerLimit;
    });
  }

  get _topCardThreshold() {
    const threshold =
      this._trumpCards[0].cardNumber === this._allCards.slice(-1)[0].cardNumber
        ? 12
        : 8;
    return this._allCards.length - threshold;
  }

  getCardToWinStep(myCards: CardWithHeights[]) {
    if (!this._amILast) {
      return null;
    }
    const opponentCardHeights = this._theirStepCards.map(
      (card) => card.groupHeight,
    );
    const threshold = Math.max(...opponentCardHeights);
    for (const card of myCards) {
      if (card.groupHeight > threshold) {
        return card;
      }
    }
    return null;
  }

  getCardToDrawStep(myCards: CardWithHeights[]) {
    if (!this._amILast) {
      return null;
    }
    const opponentCardHeights = this._theirStepCards.map(
      (card) => card.groupHeight,
    );
    const threshold = Math.max(...opponentCardHeights);
    for (const card of myCards) {
      if (card.groupHeight === threshold) {
        return card;
      }
    }
    return null;
  }

  get _willILoseAnyway() {
    if (!this._amILast) {
      return null;
    }
    const opponentCardHeights = this._theirStepCards.map(
      (card) => card.groupHeight,
    );
    const threshold = Math.max(...opponentCardHeights);
    return this._myHandAscending.every((card) => card.groupHeight < threshold);
  }

  get _amILast() {
    return this._theirStepCards.length === 2 && this._ourStepCards.length === 1;
  }

  get _myTrumps() {
    return this._trumpCards.map((trump) => {
      if (this._myHandAscending.some((card) => card.isEqual(trump))) {
        return true;
      }
      if (this._allPreviousCards.some((card) => card.isEqual(trump))) {
        return false;
      }
      return undefined;
    });
  }

  get _myTrumpCards() {
    return this._myTrumps
      .map((flag, index) => (flag ? this._trumpCards[index] : null))
      .filter((trump) => trump !== null);
  }

  get _allPreviousCards() {
    return [...this._previousFromUs.flat(), ...this._previousFromThem.flat()];
  }

  get _ourStepCards() {
    return this._previousFromUs.slice(-1)[0];
  }

  get _theirStepCards() {
    return this._previousFromThem.slice(-1)[0];
  }

  get _round() {
    return 4 - this._myHandAscending.length;
  }

  _amIfirst() {
    return this._ourStepCards.length === 0 && this._theirStepCards.length === 0;
  }

  _isMyPartnerWinningWithTopCard() {
    const partnerCard = this._ourStepCards[0];
    if (!partnerCard) {
      return false;
    }
    const opponentCardHeights = this._theirStepCards.map((card) => card.height);
    return (
      partnerCard.height >= this._topCardThreshold &&
      opponentCardHeights.every((height) => height <= partnerCard.height)
    );
  }

  _pickBestFirstCard() {
    if (this._haveHighestTrumps(2)) {
      return this._myHandAscending[0];
    }
    if (this._haveHighestTrumps(1) && this._haveMinTrumps(2)) {
      const lowerTrump = this._myHandAscending.slice(-2)[0];
      return lowerTrump;
    }
    if (this._haveHighestTrumps(1) && this._myTopCards.length > 0) {
      return this._myTopCards.slice(-1)[0];
    }
    if (this._haveHighestTrumps(1)) {
      return (
        this.getCardToWinStep(this._myHandAscending.slice(0, -1)) ??
        this.getCardToDrawStep(this._myHandAscending.slice(0, -1)) ??
        this._myHandAscending[0]
      );
    }
    if (this._haveMinTrumps(1)) {
      return this._dontBurnCard(this._myTrumpCards[0]);
    }
    if (this._myTopCards.length > 0) {
      return (
        this.getCardToWinStep(this._myTopCards) ?? this._myTopCards.slice(-1)[0]
      );
    }
    return this._myHandAscending[0];
  }

  _pickBestSecondCard(): [CardWithHeights, CardAction] {
    if (this._haveMinTrumps(1)) {
      const otherCard = this._myHandAscending[0];
      const trumpCard = this._myHandAscending[1];
      if (this._haveHighestTrumps(1) && this._wins[0]) {
        return [otherCard, CardAction.Discard];
      }
      const haveWinOrDraw = this._wins[0] !== false;
      if (haveWinOrDraw) {
        return [
          trumpCard,
          this._wins[0] ? CardAction.Raise2 : CardAction.Raise1,
        ];
      }
      const theyHaveTopCard =
        this._ourStepCards.length === 0 &&
        this._theirStepCards.some(
          (theirCard) => theirCard.height >= this._topCardThreshold,
        );
      if (theyHaveTopCard) {
        return [trumpCard, CardAction.DoNotRaise];
      }
      // As we are losing, hope the partner can win
      return [otherCard, CardAction.DoNotRaise];
    }
    if (this._myTopCards.length) {
      return [
        this._myHandAscending[1],
        this._wins[0] ? CardAction.Raise2 : CardAction.DoNotRaise,
      ];
    }
    if (!this._wins[0]) {
      return [this._myHandAscending[1], CardAction.DoNotRaise];
    }
    return [this._myHandAscending[0], CardAction.DoNotRaise];
  }

  _haveHighestTrumps(count: number) {
    return this._myTrumps
      .filter((_trump, index) => {
        const trumpCard = this._trumpCards[index];
        if (
          this._allPreviousCards.some((previousCard) =>
            previousCard.isEqual(trumpCard),
          )
        ) {
          return false;
        }
        return true;
      })
      .slice(-1 * count)
      .every((flag) => flag);
  }

  _haveMinTrumps(count: number) {
    return this._myTrumps.filter((flag) => flag).length >= count;
  }

  _pickWorstCard() {
    return this._myHandAscending[0];
  }

  _dontBurnCard(card: CardWithHeights) {
    const opponentCardHeights = this._theirStepCards.map(
      (theirCard) => theirCard.groupHeight,
    );
    const opponentsThreshold = Math.max(...opponentCardHeights) ?? 0;
    if (card.groupHeight < opponentsThreshold) {
      return this._myHandAscending[0];
    }
    const partnerCardHeight = this._ourStepCards[0]?.height;
    const isPartnerWinningWithTopCard =
      partnerCardHeight >= this._topCardThreshold &&
      partnerCardHeight > opponentsThreshold;
    if (isPartnerWinningWithTopCard) {
      return this._myHandAscending[0];
    }
    if (card.height < partnerCardHeight) {
      return this._myHandAscending[0];
    }
    return card;
  }
}

function makePickReturn(card: Card, isHidden = false, shouldRaise = false) {
  return {
    card: new CardImplementation(card.cardNumber, card.suit),
    isHidden,
    shouldRaise,
  };
}

function getCardsWithHeights(
  cards: Card[],
  trumpCardNumber: number,
  hand: Card[],
  previousFromUs: Card[][],
  previousFromThem: Card[][],
) {
  const allCards: CardWithHeights[] = [];
  const trumpCards: CardWithHeights[] = [];
  const handWithHeights: CardWithHeights[] = [];
  const previousFromUsWithHeights: CardWithHeights[][] = previousFromUs.map(
    () => [],
  );
  const previousFromThemWithHeights: CardWithHeights[][] = previousFromThem.map(
    () => [],
  );
  cards.forEach((card, index) => {
    const cardWithHeight = {
      ...card,
      height:
        index +
        (card.cardNumber === trumpCardNumber ? cards.length + card.suit : 0),
      groupHeight:
        Math.trunc(index / 4) +
        (card.cardNumber === trumpCardNumber ? cards.length + card.suit : 0),
      isEqual: card.isEqual,
      toString: card.toString,
    };
    allCards.push(cardWithHeight);
    if (card.cardNumber === trumpCardNumber) {
      trumpCards.push(cardWithHeight);
    }
    if (hand.some((handCard) => handCard.isEqual(card))) {
      handWithHeights.push(cardWithHeight);
    }
    previousFromUs.forEach((step, stepIndex) => {
      step.forEach((stepCard, cardIndex) => {
        if (stepCard.isEqual(card)) {
          previousFromUsWithHeights[stepIndex][cardIndex] = cardWithHeight;
        }
      });
    });
    previousFromThem.forEach((step, stepIndex) => {
      step.forEach((stepCard, cardIndex) => {
        if (stepCard.isEqual(card)) {
          previousFromThemWithHeights[stepIndex][cardIndex] = cardWithHeight;
        }
      });
    });
  });
  return [
    allCards,
    trumpCards,
    handWithHeights,
    previousFromUsWithHeights,
    previousFromThemWithHeights,
  ] as const;
}

function defaultGetRaiseByLevel(level: number) {
  if (level < 1) {
    return false;
  }
  if (level >= 3) {
    return true;
  }
  if (level === 2) {
    return Math.random() - 0.5 > 0;
  }
  return Math.random() - 0.66 > 0;
}
