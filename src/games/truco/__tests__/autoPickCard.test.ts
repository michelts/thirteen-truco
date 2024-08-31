import { Card, Suit } from "@/core";
import { describe, expect, it } from "vitest";
import { autoPickCard } from "../index";

describe("first card", () => {
  it("should pick lower non-trump card when player is head of round to avoid having it killed", () => {
    const hand = [
      new Card(3, Suit.Clubs),
      new Card(4, Suit.Clubs),
      new Card(6, Suit.Clubs),
    ];
    expect(autoPickCard({ hand, trumpCards: [] })).toEqual({
      card: new Card(4, Suit.Clubs),
      isHidden: false,
    });
  });
});

describe("last card", () => {
  it("should pick the last card if only one left", () => {
    const hand = [new Card(6, Suit.Clubs)];
    expect(autoPickCard({ hand, trumpCards: [] })).toEqual({
      card: new Card(6, Suit.Clubs),
      isHidden: false,
    });
  });

  it("should pick the last card if only one left, even if trump", () => {
    const hand = [new Card(6, Suit.Clubs)];
    expect(autoPickCard({ hand, trumpCards: [hand[0]] })).toEqual({
      card: new Card(6, Suit.Clubs),
      isHidden: false,
    });
  });
});
