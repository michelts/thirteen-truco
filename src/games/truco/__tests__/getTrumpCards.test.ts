import { Card } from "@/core";
import { Suit } from "@/types";
import { expect, it } from "vitest";
import { getTrumpCards } from "../getTrumpCards";

it("should return the card with highest value based on the deck position", () => {
  const cardsFromLowestToHighest = [
    new Card(4, Suit.Spades),
    new Card(4, Suit.Hearts),
    new Card(6, Suit.Spades),
    new Card(6, Suit.Hearts),
    new Card(11, Suit.Spades),
    new Card(11, Suit.Hearts),
  ];
  const turnedCard = new Card(4, Suit.Spades);
  const trumpCards = getTrumpCards(cardsFromLowestToHighest, turnedCard);
  expect(trumpCards).toEqual([
    new Card(6, Suit.Hearts),
    new Card(6, Suit.Spades),
  ]);
});

it("should return the latest card if the turned card is before it", () => {
  const cardsFromLowestToHighest = [
    new Card(4, Suit.Spades),
    new Card(4, Suit.Hearts),
    new Card(6, Suit.Spades),
    new Card(6, Suit.Hearts),
    new Card(11, Suit.Spades),
    new Card(11, Suit.Hearts),
  ];
  const turnedCard = new Card(6, Suit.Hearts);
  const trumpCards = getTrumpCards(cardsFromLowestToHighest, turnedCard);
  expect(trumpCards).toEqual([
    new Card(11, Suit.Hearts),
    new Card(11, Suit.Spades),
  ]);
});

it("should consider the lowest card number as trump card if turned card is the highest", () => {
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
  const turnedCard = new Card(3, Suit.Hearts);
  const trumpCards = getTrumpCards(cardsFromLowestToHighest, turnedCard);
  expect(trumpCards).toEqual([
    new Card(4, Suit.Clubs),
    new Card(4, Suit.Spades),
  ]);
});

it("should throw error if turned card is not part of the sorted cards", () => {
  const cardsFromHighestToLowest = [
    new Card(12, Suit.Diamonds),
    new Card(1, Suit.Diamonds),
    new Card(2, Suit.Clubs),
    new Card(3, Suit.Clubs),
  ];
  const unexpectedTurnedCard = new Card(11, Suit.Diamonds);
  expect(() =>
    getTrumpCards(cardsFromHighestToLowest, unexpectedTurnedCard),
  ).toThrowError();
});
