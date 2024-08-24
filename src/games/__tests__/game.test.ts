import type { Step, StepCard } from "@/types";
import { Card, Deck, Suit } from "@/core";
import { TrucoPlayer } from "@/players";
import { expect, it } from "vitest";
import { TrucoGame } from "../index";

function customShuffle<T>(cards: T[]): void {
  cards.reverse();
}

const customDeck = new Deck(
  [
    new Card(3, Suit.Clubs),
    new Card(2, Suit.Clubs),
    new Card(1, Suit.Clubs),
    new Card(3, Suit.Hearts),
    new Card(2, Suit.Hearts),
    new Card(1, Suit.Hearts),
  ],
  customShuffle,
);

it("should shuffle the deck and give 3 distinct cards to each player", () => {
  const game = new TrucoGame(customDeck);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  expect(game.players[0].cards).toEqual([
    new Card(1, Suit.Hearts),
    new Card(2, Suit.Hearts),
    new Card(3, Suit.Hearts),
  ]);
  expect(game.players[1].cards).toEqual([
    new Card(1, Suit.Clubs),
    new Card(2, Suit.Clubs),
    new Card(3, Suit.Clubs),
  ]);
});

it("should allow player to drop cards on the table", () => {
  const game = new TrucoGame(customDeck);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toEqual([]);
  expect(game.currentPlayer).toEqual(game.players[0]);

  game.players[0].dropCard(new Card(1, Suit.Hearts));
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(1);
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
  ]);
  expect(game.currentRound.currentStep.isDone).toEqual(false);
  expect(game.currentPlayer).toEqual(game.players[1]);

  game.players[1].dropCard(new Card(1, Suit.Clubs));
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(1);
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
    { card: new Card(1, Suit.Clubs), isHidden: false },
  ]);
  expect(game.currentRound.currentStep.isDone).toEqual(true);
  expect(game.currentPlayer).toEqual(null);

  game.currentRound.advanceStep();
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(2);
  expect(game.currentRound.currentStep.cards).toEqual([]);
  expect(game.currentPlayer).toEqual(game.players[0]);
});

it("should allow player to drop card as hidden", () => {
  const game = new TrucoGame(customDeck);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  game.players[0].dropCard(new Card(1, Suit.Hearts), true);
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: true },
  ]);
});

it("should prevent player dropping multiple cards in the same round", () => {
  const game = new TrucoGame(customDeck);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  game.players[0].dropCard(new Card(1, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
  ]);
  expect(() =>
    game.players[0].dropCard(new Card(2, Suit.Hearts)),
  ).toThrowError();

  // game can continue after that
  game.players[1].dropCard(new Card(1, Suit.Clubs));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
    { card: new Card(1, Suit.Clubs), isHidden: false },
  ]);
  expect(game.currentRound.currentStep.isDone).toEqual(true);

  game.currentRound.advanceStep();
  game.players[0].dropCard(new Card(2, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(2, Suit.Hearts), isHidden: false },
  ]);
});

function assertStepHasCards(step: Step, expectedCards: StepCard[]) {
  expect(step.cards).toHaveLength(expectedCards.length);
  step.cards.forEach((card, index) => {
    expect(card).toMatchObject(expectedCards[index]);
  });
}
