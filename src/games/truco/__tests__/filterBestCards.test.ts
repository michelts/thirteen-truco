import { Card, Suit } from "@/core";
import { expect, it } from "vitest";
import { filterBestCards } from "../filterBestCards";

it("should return the card with highest value based on the deck position", () => {
  const cardsFromLowestToHighest = [
    new Card(4, Suit.Spades),
    new Card(6, Suit.Hearts),
    new Card(11, Suit.Hearts),
    new Card(12, Suit.Hearts),
    new Card(1, Suit.Hearts),
    new Card(2, Suit.Hearts),
    new Card(3, Suit.Hearts),
  ];
  const trumpCardNumber = 6;
  const bestCards = filterBestCards(
    [
      new Card(12, Suit.Hearts),
      new Card(11, Suit.Hearts),
      new Card(3, Suit.Hearts),
      new Card(2, Suit.Hearts),
    ],
    cardsFromLowestToHighest,
    trumpCardNumber,
  );
  expect(bestCards).toEqual([new Card(3, Suit.Hearts)]);
});

it("should consider trump card number", () => {
  const cardsFromLowestToHighest = [
    new Card(4, Suit.Spades),
    new Card(4, Suit.Clubs),
    new Card(6, Suit.Hearts),
    new Card(6, Suit.Clubs),
    new Card(11, Suit.Hearts),
    new Card(11, Suit.Clubs),
    new Card(2, Suit.Hearts),
    new Card(2, Suit.Clubs),
    new Card(3, Suit.Hearts),
    new Card(3, Suit.Clubs),
  ];
  const trumpCardNumber = 11;
  const bestCards = filterBestCards(
    [
      new Card(3, Suit.Clubs),
      new Card(11, Suit.Hearts),
      new Card(3, Suit.Hearts),
      new Card(2, Suit.Hearts),
    ],
    cardsFromLowestToHighest,
    trumpCardNumber,
  );
  expect(bestCards).toEqual([new Card(11, Suit.Hearts)]);
});

it("should return all tied cards if they are not trump cards", () => {
  const cardsFromLowestToHighest = [
    new Card(12, Suit.Diamonds),
    new Card(1, Suit.Diamonds),
    new Card(2, Suit.Diamonds),
    new Card(2, Suit.Spades),
    new Card(2, Suit.Hearts),
    new Card(2, Suit.Clubs),
    new Card(3, Suit.Diamonds),
    new Card(3, Suit.Spades),
    new Card(3, Suit.Hearts),
    new Card(3, Suit.Clubs),
  ];
  const trumpCardNumber = 1;
  const bestCards = filterBestCards(
    [
      new Card(3, Suit.Hearts),
      new Card(3, Suit.Clubs),
      new Card(2, Suit.Diamonds),
      new Card(2, Suit.Hearts),
    ],
    cardsFromLowestToHighest,
    trumpCardNumber,
  );
  expect(bestCards).toEqual([
    new Card(3, Suit.Clubs),
    new Card(3, Suit.Hearts),
  ]);
});

it("should return the highest trump card in case of a tie", () => {
  const cardsFromLowestToHighest = [
    new Card(12, Suit.Diamonds),
    new Card(1, Suit.Diamonds),
    new Card(2, Suit.Diamonds),
    new Card(2, Suit.Spades),
    new Card(2, Suit.Hearts),
    new Card(2, Suit.Clubs),
    new Card(3, Suit.Diamonds),
    new Card(3, Suit.Spades),
    new Card(3, Suit.Hearts),
    new Card(3, Suit.Clubs),
  ];
  const trumpCardNumber = 2;
  const bestCards = filterBestCards(
    [
      new Card(3, Suit.Hearts),
      new Card(3, Suit.Clubs),
      new Card(2, Suit.Diamonds),
      new Card(2, Suit.Hearts),
    ],
    cardsFromLowestToHighest,
    trumpCardNumber,
  );
  expect(bestCards).toEqual([new Card(2, Suit.Hearts)]);
});
