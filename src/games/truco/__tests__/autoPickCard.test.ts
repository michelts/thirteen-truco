import type { Deck } from "@/core";
import { Card, Suit } from "@/core";
import { beforeAll, describe, expect, it } from "vitest";
import { autoPickCard } from "../index";
import { getDefaultDeck } from "@/config";

let deck: Deck;

beforeAll(() => {
  deck = getDefaultDeck();
});

describe("first card", () => {
  it.each([2, 3])(
    "should pick highest card to help highest trump (%s)",
    (cardNumber) => {
      const hand = [
        new Card(cardNumber, Suit.Clubs),
        new Card(4, Suit.Clubs),
        new Card(6, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [[]],
          previousFromTheirs: [[]],
        }),
      ).toEqual({
        card: new Card(cardNumber, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each([2, 3])(
    "should ignore highest card if partner already put a higher card (%s)",
    (cardNumber) => {
      const hand = [
        new Card(cardNumber, Suit.Clubs),
        new Card(4, Suit.Clubs),
        new Card(5, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [[new Card(cardNumber, Suit.Hearts)]],
          previousFromTheirs: [[]],
        }),
      ).toEqual({
        card: new Card(4, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each([Suit.Diamonds, Suit.Spades, Suit.Clubs])(
    "should ignore highest card if partner already put a trump card (%s)",
    (trumpSuit) => {
      const hand = [
        new Card(3, Suit.Clubs),
        new Card(4, Suit.Clubs),
        new Card(5, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [[new Card(6, trumpSuit)]],
          previousFromTheirs: [[]],
        }),
      ).toEqual({
        card: new Card(4, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each([Suit.Diamonds, Suit.Spades, Suit.Hearts])(
    "should pick any lower trump (%s)",
    (myTrumpSuit) => {
      const hand = [
        new Card(3, Suit.Clubs),
        new Card(4, Suit.Clubs),
        new Card(6, myTrumpSuit),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [[]],
          previousFromTheirs: [[]],
        }),
      ).toEqual({
        card: new Card(6, myTrumpSuit),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it("should pick lower non-trump card when player is head of round to avoid having it killed", () => {
    const hand = [
      new Card(3, Suit.Clubs),
      new Card(4, Suit.Clubs),
      new Card(6, Suit.Clubs),
    ];
    expect(
      call({
        hand,
        trumpCardNumber: 5,
        previousFromOurs: [[]],
        previousFromTheirs: [[]],
      }),
    ).toEqual({
      card: new Card(4, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });

  it("should pick higher non-trump card when player is tail of round", () => {
    const hand = [
      new Card(3, Suit.Clubs),
      new Card(4, Suit.Clubs),
      new Card(6, Suit.Clubs),
    ];
    expect(
      call({
        hand,
        trumpCardNumber: 5,
        previousFromOurs: [[new Card(7, Suit.Clubs)]],
        previousFromTheirs: [[new Card(7, Suit.Hearts)]],
      }),
    ).toEqual({
      card: new Card(3, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });

  it.each([Suit.Diamonds, Suit.Spades, Suit.Hearts])(
    "should kill enemy trump card if I can and raise stakes",
    (trumpSuit) => {
      const hand = [
        new Card(3, Suit.Clubs),
        new Card(4, Suit.Clubs),
        new Card(6, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [[new Card(7, Suit.Clubs)]],
          previousFromTheirs: [[new Card(6, trumpSuit)]],
        }),
      ).toEqual({
        card: new Card(6, Suit.Clubs),
        isHidden: false,
        shouldRaise: true,
      });
    },
  );

  it.each([Suit.Clubs, Suit.Hearts])(
    "should not try to kill enemy trump card if I cant",
    (trumpSuit) => {
      const hand = [
        new Card(3, Suit.Clubs),
        new Card(4, Suit.Clubs),
        new Card(6, Suit.Spades),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [[new Card(7, Suit.Clubs)]],
          previousFromTheirs: [[new Card(6, trumpSuit)]],
        }),
      ).toEqual({
        card: new Card(4, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );
});

describe.each([Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs])(
  "second card is trump (%s)",
  (trumpSuit) => {
    it("should use highest trump and raise stakes if draw first step", () => {
      const hand = [new Card(6, trumpSuit), new Card(3, Suit.Clubs)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [
            [new Card(4, Suit.Clubs), new Card(2, Suit.Clubs)],
            [],
          ],
          previousFromTheirs: [
            [new Card(4, Suit.Hearts), new Card(2, Suit.Hearts)],
            [],
          ],
          winners: [undefined], // difference from our score to their
        }),
      ).toEqual({
        card: new Card(6, trumpSuit),
        isHidden: false,
        shouldRaise: true,
      });
    });

    it("should use highest trump and raise stakes if win first step", () => {
      const hand = [new Card(6, trumpSuit), new Card(3, Suit.Clubs)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [
            [new Card(4, Suit.Clubs), new Card(3, Suit.Hearts)],
            [],
          ],
          previousFromTheirs: [
            [new Card(4, Suit.Hearts), new Card(2, Suit.Hearts)],
            [],
          ],
          winners: [0], // difference from our score to their
        }),
      ).toEqual({
        card: new Card(6, trumpSuit),
        isHidden: false,
        shouldRaise: true,
      });
    });

    it("should use highest trump but don't raise stakes if lost first step", () => {
      const hand = [new Card(6, trumpSuit), new Card(3, Suit.Clubs)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromOurs: [
            [new Card(4, Suit.Clubs), new Card(1, Suit.Hearts)],
            [],
          ],
          previousFromTheirs: [
            [new Card(4, Suit.Hearts), new Card(2, Suit.Hearts)],
            [],
          ],
          winners: [1], // difference from our score to their
        }),
      ).toEqual({
        card: new Card(6, trumpSuit),
        isHidden: false,
        shouldRaise: false,
      });
    });
  },
);

describe("last card", () => {
  it("should pick the last card if single one left", () => {
    const hand = [new Card(6, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 5,
        previousFromOurs: [
          [new Card(4, Suit.Hearts), new Card(4, Suit.Clubs)],
          [new Card(7, Suit.Hearts), new Card(7, Suit.Clubs)],
        ],
        previousFromTheirs: [
          [new Card(7, Suit.Hearts), new Card(7, Suit.Clubs)],
          [new Card(4, Suit.Hearts), new Card(4, Suit.Clubs)],
        ],
      }),
    ).toEqual({
      card: new Card(6, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });

  it("should pick the last card if single one left, even if trump", () => {
    const hand = [new Card(6, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromOurs: [
          [new Card(4, Suit.Hearts), new Card(4, Suit.Clubs)],
          [new Card(7, Suit.Hearts), new Card(7, Suit.Clubs)],
        ],
        previousFromTheirs: [
          [new Card(7, Suit.Hearts), new Card(7, Suit.Clubs)],
          [new Card(4, Suit.Hearts), new Card(4, Suit.Clubs)],
        ],
      }),
    ).toEqual({
      card: new Card(6, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });
});

function call({
  hand,
  trumpCardNumber,
  previousFromOurs,
  previousFromTheirs,
  winners = [],
}: {
  hand: Card[];
  trumpCardNumber: number;
  previousFromOurs: Card[][];
  previousFromTheirs: Card[][];
  winners?: (0 | 1 | undefined)[];
}) {
  // Wraps the autoPickCard call to allow using objects and give more
  // flexibility for tests. The function autoPickCard uses positional
  // parameters to reduce the bundle size
  return autoPickCard(
    hand,
    previousFromOurs,
    previousFromTheirs,
    winners,
    makeTrumpCards(trumpCardNumber),
    deck.cardsFromLowestToHighest,
  );
}

function makeTrumpCards(cardNumber: number) {
  return [Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs].map(
    (suit) => new Card(cardNumber, suit),
  );
}
