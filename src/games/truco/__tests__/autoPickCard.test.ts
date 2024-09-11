import { getDefaultDeck } from "@/config";
import { Card } from "@/core";
import { type Deck, Suit } from "@/types";
import { range } from "@/utils/range";
import { beforeAll, describe, expect, it } from "vitest";
import { autoPickCard } from "../index";

let deck: Deck;

beforeAll(() => {
  deck = getDefaultDeck();
});

describe("first card", () => {
  describe.each`
    case                                | partnerCard  | opponentCard
    ${"I am first"}                     | ${undefined} | ${undefined}
    ${"I am second"}                    | ${undefined} | ${10}
    ${"We are winning with lower card"} | ${12}        | ${10}
    ${"We are losing"}                  | ${10}        | ${12}
  `(
    "$case",
    ({
      partnerCard,
      opponentCard,
    }: { partnerCard: number; opponentCard: number }) => {
      const previousFromUs = [
        [partnerCard]
          .filter((cardNumber) => cardNumber)
          .map((cardNumber) => new Card(cardNumber, Suit.Diamonds)),
      ];
      const previousFromThem = [
        [opponentCard]
          .filter((cardNumber) => cardNumber)
          .map((cardNumber) => new Card(cardNumber, Suit.Diamonds)),
      ];

      it("should pick lowest card if I have clubs and hearts", () => {
        const hand = [
          new Card(6, Suit.Hearts),
          new Card(6, Suit.Clubs),
          new Card(7, Suit.Clubs),
        ];
        expect(
          call({
            hand,
            trumpCardNumber: 6,
            previousFromUs,
            previousFromThem,
          }),
        ).toEqual({
          card: new Card(7, Suit.Clubs),
          isHidden: false,
          shouldRaise: false,
        });
      });

      it.each([Suit.Diamonds, Suit.Spades])(
        "should pick lowest trump if I have clubs and another trump (%s)",
        (suit) => {
          const hand = [
            new Card(6, Suit.Clubs),
            new Card(7, Suit.Clubs),
            new Card(6, suit),
          ];
          expect(
            call({
              hand,
              trumpCardNumber: 6,
              previousFromUs,
              previousFromThem,
            }),
          ).toEqual({
            card: new Card(6, suit),
            isHidden: false,
            shouldRaise: false,
          });
        },
      );

      it.each`
        trumpCardNumber | cardNumber
        ${5}            | ${3}
        ${5}            | ${2}
        ${3}            | ${2}
        ${3}            | ${1}
      `(
        "should pick highest top card (8 highest cards except trumps) if I have clubs and top cards (trump $trumpCardNumber, card: $cardNumber)",
        ({ trumpCardNumber, cardNumber }) => {
          const hand = [
            new Card(trumpCardNumber, Suit.Clubs),
            new Card(7, Suit.Diamonds),
            new Card(cardNumber, Suit.Hearts),
          ];
          expect(
            call({
              hand,
              trumpCardNumber,
              previousFromUs,
              previousFromThem,
            }),
          ).toEqual({
            card: new Card(cardNumber, Suit.Hearts),
            isHidden: false,
            shouldRaise: false,
          });
        },
      );

      it.each`
        trumpCardNumber | highestLowestCardNumber
        ${5}            | ${1}
        ${3}            | ${12}
      `(
        "should pick lowest card if I have clubs and no top cards (trump: $trumpCardNumber, card: $highestLowestCardNumber)",
        ({ trumpCardNumber, highestLowestCardNumber }) => {
          const hand = [
            new Card(trumpCardNumber, Suit.Clubs),
            new Card(7, Suit.Diamonds),
            new Card(highestLowestCardNumber, Suit.Hearts),
          ];
          expect(
            call({
              hand,
              trumpCardNumber,
              previousFromUs,
              previousFromThem,
            }),
          ).toEqual({
            card: new Card(7, Suit.Diamonds),
            isHidden: false,
            shouldRaise: false,
          });
        },
      );

      it.each`
        trumpSuits                      | pickedTrumpSuit
        ${[Suit.Diamonds, Suit.Hearts]} | ${Suit.Diamonds}
        ${[Suit.Spades, Suit.Hearts]}   | ${Suit.Spades}
        ${[Suit.Diamonds, Suit.Spades]} | ${Suit.Diamonds}
        ${[Suit.Diamonds]}              | ${Suit.Diamonds}
        ${[Suit.Spades]}                | ${Suit.Spades}
        ${[Suit.Hearts]}                | ${Suit.Hearts}
      `(
        "should pick lowest trump card if I have trumps but not clubs, regarless of top cards (trumpSuites: $trumpSuits, pickedTrump: $pickedTrumpSuit)",
        ({
          trumpSuits,
          pickedTrumpSuit,
        }: { trumpSuits: Suit[]; pickedTrumpSuit: Suit }) => {
          const trumpCardNumber = 1;
          const trumpCards = trumpSuits.map(
            (suit) => new Card(trumpCardNumber, suit),
          );
          const topCards = range(3 - trumpCards.length, 2).map(
            (cardNumber) => new Card(cardNumber, Suit.Diamonds),
          );
          const hand = [...trumpCards, ...topCards];
          expect(
            call({
              hand,
              trumpCardNumber,
              previousFromUs,
              previousFromThem,
            }),
          ).toEqual({
            card: new Card(trumpCardNumber, pickedTrumpSuit),
            isHidden: false,
            shouldRaise: false,
          });
        },
      );

      it.each`
        trumpCardNumber | highestTop | lowestTop
        ${5}            | ${3}       | ${2}
        ${3}            | ${2}       | ${1}
      `(
        "should pick highest top card if no trump cards (trump: $trumpCardNumber, cards: $highestTop, $lowestTop)",
        ({ trumpCardNumber, highestTop, lowestTop }) => {
          const hand = [
            new Card(lowestTop, Suit.Clubs),
            new Card(7, Suit.Diamonds),
            new Card(highestTop, Suit.Hearts),
          ];
          expect(
            call({
              hand,
              trumpCardNumber,
              previousFromUs,
              previousFromThem,
            }),
          ).toEqual({
            card: new Card(highestTop, Suit.Hearts),
            isHidden: false,
            shouldRaise: false,
          });
        },
      );

      it.each`
        trumpCardNumber | cardNumbers     | pickedCardNumber
        ${5}            | ${[1, 12, 11]}  | ${11}
        ${3}            | ${[12, 11, 10]} | ${10}
      `(
        "should pick lowest lower card if no trump nor top cards (trump: $trumpCardNumber, cards: $cardNumbers, $pickedCardNumber)",
        ({
          trumpCardNumber,
          cardNumbers,
          pickedCardNumber,
        }: {
          trumpCardNumber: number;
          cardNumbers: number[];
          pickedCardNumber: number;
        }) => {
          const hand = cardNumbers.map(
            (cardNumber) => new Card(cardNumber, Suit.Clubs),
          );
          expect(
            call({
              hand,
              trumpCardNumber,
              previousFromUs,
              previousFromThem,
            }),
          ).toEqual({
            card: new Card(pickedCardNumber, Suit.Clubs),
            isHidden: false,
            shouldRaise: false,
          });
        },
      );
    },
  );

  it.each`
    trumpCardNumber | theirCardNumber | ourCardNumber
    ${5}            | ${3}            | ${2}
    ${5}            | ${2}            | ${1}
    ${3}            | ${2}            | ${1}
    ${3}            | ${1}            | ${12}
  `(
    "should pick the lowest card if I have club trumps and my other top card wont win (trump $trumpCardNumber, theirCard: $theirCardNumber, ourCard: $ourCardNumber)",
    ({ trumpCardNumber, theirCardNumber, ourCardNumber }) => {
      const hand = [
        new Card(trumpCardNumber, Suit.Clubs),
        new Card(7, Suit.Clubs),
        new Card(ourCardNumber, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber,
          previousFromUs: [[new Card(7, Suit.Diamonds)]],
          previousFromThem: [
            [new Card(7, Suit.Spades), new Card(theirCardNumber, Suit.Spades)],
          ],
        }),
      ).toEqual({
        card: new Card(7, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each`
    myTrump          | theirTrump
    ${Suit.Diamonds} | ${Suit.Spades}
    ${Suit.Spades}   | ${Suit.Hearts}
  `(
    "should not burn lowest trump card if it would lose from step cards (myTrump: $myTrump, theirTrump: $theirTrump)",
    ({ myTrump, theirTrump }: { myTrump: Suit; theirTrump: Suit }) => {
      const hand = [
        new Card(7, Suit.Spades),
        new Card(10, Suit.Spades),
        new Card(5, myTrump),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 5,
          previousFromUs: [[]],
          previousFromThem: [[new Card(5, theirTrump)]],
        }),
      ).toEqual({
        card: new Card(7, Suit.Spades),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each`
    myTrump          | hisTrump
    ${Suit.Diamonds} | ${Suit.Spades}
    ${Suit.Spades}   | ${Suit.Hearts}
  `(
    "should not burn lowest trump card if my partner already used a higher trump (myTrump: $myTrump, hisTrump: $hisTrump)",
    ({ myTrump, hisTrump }: { myTrump: Suit; hisTrump: Suit }) => {
      const hand = [
        new Card(7, Suit.Spades),
        new Card(10, Suit.Spades),
        new Card(5, myTrump),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 5,
          previousFromUs: [[new Card(5, hisTrump)]],
          previousFromThem: [[new Card(10, Suit.Spades)]],
        }),
      ).toEqual({
        card: new Card(7, Suit.Spades),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each`
    myTrump        | hisTrump
    ${Suit.Spades} | ${Suit.Diamonds}
    ${Suit.Hearts} | ${Suit.Diamonds}
    ${Suit.Hearts} | ${Suit.Spades}
    ${Suit.Clubs}  | ${Suit.Diamonds}
    ${Suit.Clubs}  | ${Suit.Spades}
    ${Suit.Clubs}  | ${Suit.Hearts}
  `(
    "should not burn highest trump card if my partner already used a lower trump (myTrump: $myTrump, hisTrump: $hisTrump)",
    ({ myTrump, hisTrump }: { myTrump: Suit; hisTrump: Suit }) => {
      const hand = [
        new Card(7, Suit.Spades),
        new Card(10, Suit.Spades),
        new Card(5, myTrump),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 5,
          previousFromUs: [[new Card(5, hisTrump)]],
          previousFromThem: [[new Card(10, Suit.Spades)]],
        }),
      ).toEqual({
        card: new Card(7, Suit.Spades),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  describe("I can win or draw while I have trump and no top card", () => {
    it.each`
      trumpCardNumber | highestLowestCardNumber
      ${5}            | ${1}
      ${3}            | ${12}
    `(
      "should pick lowest card that can win when I have clubs and no top cards (trump: $trumpCardNumber, card: $highestLowestCardNumber)",
      ({ trumpCardNumber, highestLowestCardNumber }) => {
        const hand = [
          new Card(trumpCardNumber, Suit.Clubs),
          new Card(7, Suit.Diamonds),
          new Card(highestLowestCardNumber, Suit.Hearts),
        ];
        expect(
          call({
            hand,
            trumpCardNumber,
            previousFromUs: [[new Card(7, Suit.Spades)]],
            previousFromThem: [
              [new Card(7, Suit.Hearts), new Card(7, Suit.Clubs)],
            ],
          }),
        ).toEqual({
          card: new Card(highestLowestCardNumber, Suit.Hearts),
          isHidden: false,
          shouldRaise: false,
        });
      },
    );

    it("should pick lowest card that can draw when I have clubs and no top cards (trump: $trumpCardNumber, card: $highestLowestCardNumber)", () => {
      const hand = [
        new Card(5, Suit.Clubs),
        new Card(7, Suit.Diamonds),
        new Card(6, Suit.Hearts),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 5,
          previousFromUs: [[new Card(6, Suit.Spades)]],
          previousFromThem: [
            [new Card(7, Suit.Hearts), new Card(7, Suit.Clubs)],
          ],
        }),
      ).toEqual({
        card: new Card(7, Suit.Diamonds),
        isHidden: false,
        shouldRaise: false,
      });
    });
  });

  describe("I am the last of step", () => {
    it("should pick lowest card if we are winning with top card", () => {
      const hand = [
        new Card(6, Suit.Clubs),
        new Card(1, Suit.Clubs),
        new Card(3, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [[new Card(3, Suit.Hearts)]],
          previousFromThem: [[new Card(7, Suit.Hearts)]],
        }),
      ).toEqual({
        card: new Card(1, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    });

    it("should pick lowest card if we are drawing with top card", () => {
      const hand = [
        new Card(6, Suit.Clubs),
        new Card(1, Suit.Clubs),
        new Card(3, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [[new Card(3, Suit.Hearts)]],
          previousFromThem: [[new Card(3, Suit.Diamonds)]],
        }),
      ).toEqual({
        card: new Card(1, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    });

    it("should pick card high enough to win the opponents", () => {
      const hand = [
        new Card(6, Suit.Clubs),
        new Card(1, Suit.Clubs),
        new Card(3, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 5,
          previousFromUs: [[new Card(7, Suit.Hearts)]],
          previousFromThem: [
            [new Card(7, Suit.Hearts), new Card(12, Suit.Hearts)],
          ],
        }),
      ).toEqual({
        card: new Card(1, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    });
  });

  describe("We will lose", () => {
    it("should pick the lowest card to win if we would lose otherwise", () => {
      const hand = [
        new Card(2, Suit.Clubs),
        new Card(3, Suit.Clubs),
        new Card(1, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [[new Card(12, Suit.Diamonds)]],
          previousFromThem: [
            [new Card(7, Suit.Hearts), new Card(1, Suit.Hearts)],
          ],
        }),
      ).toEqual({
        card: new Card(2, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    });

    it("should pick lowest card to draw if I cannot win", () => {
      const hand = [
        new Card(2, Suit.Clubs),
        new Card(1, Suit.Clubs),
        new Card(3, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [[new Card(12, Suit.Diamonds)]],
          previousFromThem: [
            [new Card(7, Suit.Hearts), new Card(3, Suit.Hearts)],
          ],
        }),
      ).toEqual({
        card: new Card(3, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    });

    it("should pick lowest card if I cannot win or draw", () => {
      const hand = [
        new Card(2, Suit.Clubs),
        new Card(7, Suit.Clubs),
        new Card(1, Suit.Clubs),
      ];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [[new Card(12, Suit.Diamonds)]],
          previousFromThem: [
            [new Card(7, Suit.Hearts), new Card(3, Suit.Hearts)],
          ],
        }),
      ).toEqual({
        card: new Card(7, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    });
  });
});

describe("second card", () => {
  it("shoud pick lowest of highest trumps if we are losing and leave raising to last step", () => {
    const hand = [new Card(6, Suit.Clubs), new Card(6, Suit.Hearts)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(7, Suit.Diamonds), new Card(2, Suit.Hearts)],
          [],
        ],
        wins: [false],
      }),
    ).toEqual({
      card: new Card(6, Suit.Hearts),
      isHidden: false,
      shouldRaise: false,
    });
  });

  it("shoud pick lowest of highest trumps left when clubs already gone, if we are losing and leave raising to last step", () => {
    const hand = [new Card(6, Suit.Spades), new Card(6, Suit.Hearts)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(7, Suit.Diamonds), new Card(6, Suit.Clubs)],
          [],
        ],
        wins: [false],
      }),
    ).toEqual({
      card: new Card(6, Suit.Spades),
      isHidden: false,
      shouldRaise: false,
    });
  });

  it.each`
    trumpSuit        | myFirstCard | wins
    ${Suit.Clubs}    | ${2}        | ${[undefined]}
    ${Suit.Hearts}   | ${2}        | ${[undefined]}
    ${Suit.Hearts}   | ${3}        | ${[true]}
    ${Suit.Spades}   | ${2}        | ${[undefined]}
    ${Suit.Spades}   | ${3}        | ${[true]}
    ${Suit.Diamonds} | ${2}        | ${[undefined]}
    ${Suit.Diamonds} | ${3}        | ${[true]}
  `(
    "shoud pick highest trump and raise level 1 if I am winning or drawing (${myFirstCard} -> ${wins})",
    ({ trumpSuit, myFirstCard, wins }) => {
      // Notice if I have the clubs trump, I will hold it and hope opponents raise stakes first
      const hand = [new Card(6, trumpSuit), new Card(7, Suit.Clubs)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [
            [new Card(7, Suit.Spades), new Card(myFirstCard, Suit.Clubs)],
            [],
          ],
          previousFromThem: [
            [new Card(7, Suit.Diamonds), new Card(2, Suit.Hearts)],
            [],
          ],
          wins,
        }),
      ).toEqual({
        card: new Card(6, trumpSuit),
        isHidden: false,
        shouldRaise: true,
      });
    },
  );

  it.each`
    myTrump          | hisTrump
    ${Suit.Diamonds} | ${Suit.Spades}
    ${Suit.Spades}   | ${Suit.Hearts}
  `(
    "should not burn lowest trump card if my partner already used a higher trump (myTrump: $myTrump, hisTrump: $hisTrump)",
    ({ myTrump, hisTrump }: { myTrump: Suit; hisTrump: Suit }) => {
      const hand = [new Card(7, Suit.Spades), new Card(5, myTrump)];
      expect(
        call({
          hand,
          trumpCardNumber: 5,
          previousFromUs: [[new Card(10, Suit.Clubs)], [new Card(5, hisTrump)]],
          previousFromThem: [
            [new Card(11, Suit.Diamonds), new Card(11, Suit.Hearts)],
            [new Card(10, Suit.Spades)],
          ],
        }),
      ).toEqual({
        card: new Card(7, Suit.Spades),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each`
    myTrump        | hisTrump
    ${Suit.Spades} | ${Suit.Diamonds}
    ${Suit.Hearts} | ${Suit.Diamonds}
    ${Suit.Hearts} | ${Suit.Spades}
    ${Suit.Clubs}  | ${Suit.Diamonds}
    ${Suit.Clubs}  | ${Suit.Spades}
    ${Suit.Clubs}  | ${Suit.Hearts}
  `(
    "should not burn highest trump card if my partner already used a lower trump (myTrump: $myTrump, hisTrump: $hisTrump)",
    ({ myTrump, hisTrump }: { myTrump: Suit; hisTrump: Suit }) => {
      const hand = [new Card(7, Suit.Spades), new Card(5, myTrump)];
      expect(
        call({
          hand,
          trumpCardNumber: 5,
          previousFromUs: [[new Card(10, Suit.Clubs)], [new Card(5, hisTrump)]],
          previousFromThem: [
            [new Card(11, Suit.Diamonds), new Card(11, Suit.Hearts)],
            [new Card(10, Suit.Spades)],
          ],
        }),
      ).toEqual({
        card: new Card(7, Suit.Spades),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it("shoud discard if I have highest trump and I am winning", () => {
    const hand = [new Card(6, Suit.Clubs), new Card(7, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(7, Suit.Diamonds), new Card(2, Suit.Hearts)],
          [],
        ],
        wins: [true],
      }),
    ).toEqual({
      card: new Card(7, Suit.Clubs),
      isHidden: true,
      shouldRaise: false,
    });
  });

  it("shoud discard if I have 2nd highest trump, I am winning and clubs are on past steps", () => {
    const hand = [new Card(6, Suit.Hearts), new Card(7, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(7, Suit.Spades), new Card(6, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(7, Suit.Diamonds), new Card(2, Suit.Hearts)],
          [],
        ],
        wins: [true],
      }),
    ).toEqual({
      card: new Card(7, Suit.Clubs),
      isHidden: true,
      shouldRaise: false,
    });
  });

  it.each([Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs])(
    "shoud pick trump card if I lost 1st step and opponent card is top card (%s)",
    (suit) => {
      const hand = [new Card(6, suit), new Card(7, Suit.Clubs)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [
            [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
            [],
          ],
          previousFromThem: [
            [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
            [new Card(3, Suit.Hearts)],
          ],
          wins: [false],
        }),
      ).toEqual({
        card: new Card(6, suit),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each([Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs])(
    "shoud pick lower card if I lost 1st step and opponent card is lower card (%s)",
    (suit) => {
      const hand = [new Card(6, suit), new Card(7, Suit.Clubs)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [
            [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
            [],
          ],
          previousFromThem: [
            [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
            [new Card(1, Suit.Hearts)],
          ],
          wins: [false],
        }),
      ).toEqual({
        card: new Card(7, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each([true, false, undefined])(
    "shoud not burn trump card on 2nd step if winning, drawing or losing",
    (firstWin) => {
      const hand = [new Card(7, Suit.Clubs), new Card(6, Suit.Diamonds)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [
            [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
            [],
          ],
          previousFromThem: [
            [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
            [new Card(6, Suit.Hearts)],
          ],
          wins: [firstWin],
        }),
      ).toEqual({
        card: new Card(7, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it.each`
    case         | firstWin     | shouldRaise
    ${"winning"} | ${true}      | ${true}
    ${"drawing"} | ${undefined} | ${false}
    ${"losing"}  | ${false}     | ${false}
  `("shoud pick top card on 2nd step if $case", ({ firstWin, shouldRaise }) => {
    const hand = [new Card(7, Suit.Clubs), new Card(3, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [new Card(2, Suit.Diamonds)],
        ],
        wins: [firstWin],
      }),
    ).toEqual({
      card: new Card(3, Suit.Clubs),
      isHidden: false,
      shouldRaise,
    });
  });

  it.each([true, false, undefined])(
    "shoud not burn top card on 2nd step if winning, drawing or losing",
    (firstWin) => {
      const hand = [new Card(7, Suit.Clubs), new Card(3, Suit.Clubs)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [
            [new Card(7, Suit.Spades), new Card(5, Suit.Clubs)],
            [],
          ],
          previousFromThem: [
            [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
            [new Card(6, Suit.Diamonds)],
          ],
          wins: [firstWin],
        }),
      ).toEqual({
        card: new Card(7, Suit.Clubs),
        isHidden: false,
        shouldRaise: false,
      });
    },
  );

  it("should discard card lowest if we are winning 1st step but I will lose 2nd anyway", () => {
    const hand = [new Card(7, Suit.Clubs), new Card(2, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(6, Suit.Spades), new Card(5, Suit.Clubs)],
          [new Card(5, Suit.Spades)],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [new Card(6, Suit.Diamonds), new Card(5, Suit.Hearts)],
        ],
        wins: [true],
      }),
    ).toEqual({
      card: new Card(7, Suit.Clubs),
      isHidden: true,
      shouldRaise: false,
    });
  });

  it("should pick card to win step and raise if we are already winning", () => {
    const hand = [new Card(10, Suit.Clubs), new Card(11, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(6, Suit.Spades), new Card(5, Suit.Clubs)],
          [new Card(5, Suit.Spades)],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [new Card(5, Suit.Diamonds), new Card(5, Suit.Hearts)],
        ],
        wins: [true],
      }),
    ).toEqual({
      card: new Card(10, Suit.Clubs),
      isHidden: false,
      shouldRaise: true,
    });
  });

  it("should pick lowest regular card if we are winning", () => {
    const hand = [new Card(10, Suit.Clubs), new Card(11, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(6, Suit.Spades), new Card(5, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [],
        ],
        wins: [true],
      }),
    ).toEqual({
      card: new Card(10, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });

  it("should pick highest regular card if we are losing", () => {
    const hand = [new Card(10, Suit.Clubs), new Card(11, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(5, Suit.Spades), new Card(5, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [],
        ],
        wins: [false],
      }),
    ).toEqual({
      card: new Card(11, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });
});

describe("second card", () => {
  it("should raise if I will certaily win game", () => {
    const hand = [new Card(11, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(5, Suit.Spades), new Card(5, Suit.Clubs)],
          [new Card(2, Suit.Spades), new Card(4, Suit.Clubs)],
          [new Card(7, Suit.Spades)],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [new Card(4, Suit.Diamonds), new Card(4, Suit.Hearts)],
          [new Card(7, Suit.Diamonds), new Card(7, Suit.Hearts)],
        ],
        wins: [true, false],
      }),
    ).toEqual({
      card: new Card(11, Suit.Clubs),
      isHidden: false,
      shouldRaise: true,
    });
  });

  it("should not raise if I will certaily lose game", () => {
    const hand = [new Card(7, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(5, Suit.Spades), new Card(5, Suit.Clubs)],
          [new Card(2, Suit.Spades), new Card(4, Suit.Clubs)],
          [new Card(7, Suit.Spades)],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [new Card(4, Suit.Diamonds), new Card(4, Suit.Hearts)],
          [new Card(7, Suit.Diamonds), new Card(7, Suit.Hearts)],
        ],
        wins: [true, false],
      }),
    ).toEqual({
      card: new Card(7, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });

  it.each([Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs])(
    "should raise if I have a trump (%s)",
    (trumpSuit) => {
      const hand = [new Card(6, trumpSuit)];
      expect(
        call({
          hand,
          trumpCardNumber: 6,
          previousFromUs: [
            [new Card(5, Suit.Spades), new Card(5, Suit.Clubs)],
            [new Card(2, Suit.Spades), new Card(4, Suit.Clubs)],
            [],
          ],
          previousFromThem: [
            [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
            [new Card(4, Suit.Diamonds), new Card(4, Suit.Hearts)],
            [],
          ],
          wins: [true, false],
        }),
      ).toEqual({
        card: new Card(6, trumpSuit),
        isHidden: false,
        shouldRaise: true,
      });
    },
  );

  it("should raise if I have a top card", () => {
    const hand = [new Card(2, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(5, Suit.Spades), new Card(5, Suit.Clubs)],
          [new Card(2, Suit.Spades), new Card(4, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [new Card(4, Suit.Diamonds), new Card(4, Suit.Hearts)],
          [],
        ],
        wins: [true, false],
      }),
    ).toEqual({
      card: new Card(2, Suit.Clubs),
      isHidden: false,
      shouldRaise: true,
    });
  });

  it("should not raise if I have a top card but lose 1st", () => {
    const hand = [new Card(2, Suit.Clubs)];
    expect(
      call({
        hand,
        trumpCardNumber: 6,
        previousFromUs: [
          [new Card(5, Suit.Spades), new Card(5, Suit.Clubs)],
          [new Card(2, Suit.Spades), new Card(4, Suit.Clubs)],
          [],
        ],
        previousFromThem: [
          [new Card(2, Suit.Diamonds), new Card(7, Suit.Hearts)],
          [new Card(4, Suit.Diamonds), new Card(4, Suit.Hearts)],
          [],
        ],
        wins: [false, true],
      }),
    ).toEqual({
      card: new Card(2, Suit.Clubs),
      isHidden: false,
      shouldRaise: false,
    });
  });
});

function call({
  hand,
  trumpCardNumber,
  previousFromUs,
  previousFromThem,
  wins = [],
}: {
  hand: Card[];
  trumpCardNumber: number;
  previousFromUs: Card[][];
  previousFromThem: Card[][];
  wins?: (boolean | undefined)[];
}) {
  // Wraps the autoPickCard call to allow using objects and give more
  // flexibility for tests. The function autoPickCard uses positional
  // parameters to reduce the bundle size
  const getRaiseByLevel = (level: number) => level > 0;
  return autoPickCard(
    hand,
    previousFromUs,
    previousFromThem,
    wins,
    makeTrumpCards(trumpCardNumber),
    deck.cardsFromLowestToHighest,
    getRaiseByLevel,
  );
}

function makeTrumpCards(cardNumber: number) {
  return [Suit.Diamonds, Suit.Spades, Suit.Hearts, Suit.Clubs].map(
    (suit) => new Card(cardNumber, suit),
  );
}
