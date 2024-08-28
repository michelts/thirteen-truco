import { Card, Deck, Suit } from "@/core";
import { expect, it } from "vitest";
import { filterTrucoBestCards } from "../bestCards";

it("should return the card with highest value based on the deck position", () => {
  const cardsFromHighestToLowest = [
    new Card(3, Suit.Hearts),
    new Card(2, Suit.Hearts),
    new Card(1, Suit.Hearts),
    new Card(12, Suit.Hearts),
    new Card(11, Suit.Hearts),
    new Card(6, Suit.Hearts),
    new Card(4, Suit.Spades),
  ];
  const bestCards = filterTrucoBestCards(
    [
      new Card(12, Suit.Hearts),
      new Card(11, Suit.Hearts),
      new Card(3, Suit.Hearts),
      new Card(2, Suit.Hearts),
    ],
    cardsFromHighestToLowest,
    new Card(4, Suit.Spades),
  );
  expect(bestCards).toEqual([new Card(3, Suit.Hearts)]);
});

it("should consider the previous card number before the turned card as trump card", () => {
  const cardsFromHighestToLowest = [
    new Card(3, Suit.Clubs),
    new Card(3, Suit.Hearts),
    new Card(2, Suit.Clubs),
    new Card(2, Suit.Hearts),
    new Card(11, Suit.Clubs),
    new Card(11, Suit.Hearts),
    new Card(6, Suit.Clubs),
    new Card(6, Suit.Hearts),
    new Card(4, Suit.Clubs),
    new Card(4, Suit.Spades),
  ];
  const bestCards = filterTrucoBestCards(
    [
      new Card(3, Suit.Clubs),
      new Card(11, Suit.Hearts),
      new Card(3, Suit.Hearts),
      new Card(2, Suit.Hearts),
    ],
    cardsFromHighestToLowest,
    new Card(6, Suit.Hearts),
  );
  expect(bestCards).toEqual([new Card(11, Suit.Hearts)]);
});

it("should consider the last card number as trump card if turned card is the first from list", () => {
  const cardsFromHighestToLowest = [
    new Card(3, Suit.Clubs),
    new Card(3, Suit.Hearts),
    new Card(2, Suit.Clubs),
    new Card(2, Suit.Hearts),
    new Card(11, Suit.Clubs),
    new Card(11, Suit.Hearts),
    new Card(6, Suit.Clubs),
    new Card(6, Suit.Hearts),
    new Card(4, Suit.Clubs),
    new Card(4, Suit.Spades),
  ];
  const bestCards = filterTrucoBestCards(
    [
      new Card(3, Suit.Clubs),
      new Card(11, Suit.Hearts),
      new Card(6, Suit.Clubs),
      new Card(4, Suit.Clubs),
    ],
    cardsFromHighestToLowest,
    new Card(3, Suit.Hearts),
  );
  expect(bestCards).toEqual([new Card(4, Suit.Clubs)]);
});

it("should return all tied cards if they are not trump cards", () => {
  const cardsFromHighestToLowest = [
    new Card(3, Suit.Clubs),
    new Card(3, Suit.Hearts),
    new Card(3, Suit.Spades),
    new Card(3, Suit.Diamonds),
    new Card(2, Suit.Clubs),
    new Card(2, Suit.Hearts),
    new Card(2, Suit.Spades),
    new Card(2, Suit.Diamonds),
    new Card(1, Suit.Diamonds),
    new Card(12, Suit.Diamonds),
  ];
  const bestCards = filterTrucoBestCards(
    [
      new Card(3, Suit.Hearts),
      new Card(3, Suit.Clubs),
      new Card(2, Suit.Diamonds),
      new Card(2, Suit.Hearts),
    ],
    cardsFromHighestToLowest,
    new Card(12, Suit.Diamonds),
  );
  expect(bestCards).toEqual([
    new Card(3, Suit.Clubs),
    new Card(3, Suit.Hearts),
  ]);
});

it("should return the highest trump card in case of a tie", () => {
  const cardsFromHighestToLowest = [
    new Card(3, Suit.Clubs),
    new Card(3, Suit.Hearts),
    new Card(3, Suit.Spades),
    new Card(3, Suit.Diamonds),
    new Card(2, Suit.Clubs),
    new Card(2, Suit.Hearts),
    new Card(2, Suit.Spades),
    new Card(2, Suit.Diamonds),
    new Card(1, Suit.Diamonds),
    new Card(12, Suit.Diamonds),
  ];
  const bestCards = filterTrucoBestCards(
    [
      new Card(3, Suit.Hearts),
      new Card(3, Suit.Clubs),
      new Card(2, Suit.Diamonds),
      new Card(2, Suit.Hearts),
    ],
    cardsFromHighestToLowest,
    new Card(1, Suit.Diamonds),
  );
  expect(bestCards).toEqual([new Card(2, Suit.Hearts)]);
});

it("should throw error if trump card is not part of the sorted cards", () => {
  const cardsFromHighestToLowest = [
    new Card(3, Suit.Clubs),
    new Card(2, Suit.Clubs),
    new Card(1, Suit.Diamonds),
    new Card(12, Suit.Diamonds),
  ];
  expect(() =>
    filterTrucoBestCards(
      [
        new Card(3, Suit.Clubs),
        new Card(2, Suit.Clubs),
        new Card(1, Suit.Diamonds),
        new Card(12, Suit.Diamonds),
      ],
      cardsFromHighestToLowest,
      new Card(11, Suit.Diamonds),
    ),
  ).toThrowError();
});
