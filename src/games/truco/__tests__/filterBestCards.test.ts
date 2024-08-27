import { Card, Deck, Suit } from "@/core";
import { expect, it } from "vitest";
import { filterTrucoBestCards } from "../bestCards";

it("should return the card with highest value based on the deck position", () => {
  const deck = new Deck(
    [
      new Card(3, Suit.Hearts),
      new Card(2, Suit.Hearts),
      new Card(1, Suit.Hearts),
      new Card(12, Suit.Hearts),
      new Card(11, Suit.Hearts),
      new Card(10, Suit.Hearts),
    ],
    (cards) => cards,
  );
  const bestCards = filterTrucoBestCards(
    [
      new Card(12, Suit.Hearts),
      new Card(11, Suit.Hearts),
      new Card(3, Suit.Hearts),
      new Card(2, Suit.Hearts),
    ],
    deck,
  );
  expect(bestCards).toEqual([new Card(3, Suit.Hearts)]);
});

it("should consider draws", () => {
  const deck = new Deck(
    [
      new Card(3, Suit.Clubs),
      new Card(3, Suit.Hearts),
      new Card(3, Suit.Spades),
      new Card(3, Suit.Diamonds),
      new Card(2, Suit.Clubs),
      new Card(2, Suit.Hearts),
      new Card(2, Suit.Spades),
      new Card(2, Suit.Diamonds),
    ],
    (cards) => cards,
  );
  const bestCards = filterTrucoBestCards(
    [
      new Card(3, Suit.Hearts),
      new Card(3, Suit.Clubs),
      new Card(2, Suit.Diamonds),
      new Card(2, Suit.Hearts),
    ],
    deck,
  );
  expect(bestCards).toEqual([
    new Card(3, Suit.Clubs),
    new Card(3, Suit.Hearts),
  ]);
});
