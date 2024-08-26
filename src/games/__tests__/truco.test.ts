import { defaultDeck } from "@/config";
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
  const [player1, player2] = game.players;
  player1.dropCard(new Card(1, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
  ]);
  player2.dropCard(new Card(1, Suit.Clubs));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
    { card: new Card(1, Suit.Clubs), isHidden: false },
  ]);

  game.currentRound.continue();
  player1.dropCard(new Card(2, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(2, Suit.Hearts), isHidden: false },
  ]);
  player2.dropCard(new Card(2, Suit.Clubs));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(2, Suit.Hearts), isHidden: false },
    { card: new Card(2, Suit.Clubs), isHidden: false },
  ]);
});

it("should fill rounds, steps, currentRound, currentStep and currentPlayer as players drop cards", () => {
  const game = new TrucoGame(defaultDeck); // use a deck with enough cards
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  const [player1, player2] = game.players;
  expect(game.currentPlayer).toEqual(game.players[0]);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toEqual([]);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.currentStep.isDone).toEqual(false);

  player1.dropCard(player1.cards[0]);
  expect(game.currentPlayer).toEqual(player2);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toHaveLength(1);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.currentStep.isDone).toEqual(false);

  player2.dropCard(player2.cards[0]);
  expect(game.currentPlayer).toBeNull(); // because step is done
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toHaveLength(2);
  expect(game.currentRound.currentStep.isDone).toEqual(true);

  game.currentRound.continue(); // Has to explicitly continue game
  expect(game.currentPlayer).toEqual(player1);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.steps).toHaveLength(2);
  expect(game.currentRound.currentStep.cards).toHaveLength(0);
  expect(game.currentRound.currentStep.isDone).toEqual(false);

  player1.dropCard(player1.cards[0]);
  expect(game.currentPlayer).toEqual(player2);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.steps).toHaveLength(2);
  expect(game.currentRound.currentStep.cards).toHaveLength(1);
  expect(game.currentRound.currentStep.isDone).toEqual(false);

  player2.dropCard(player2.cards[0]);
  expect(game.currentPlayer).toBeNull();
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.steps).toHaveLength(2);
  expect(game.currentRound.currentStep.cards).toHaveLength(2);
  expect(game.currentRound.currentStep.isDone).toEqual(true);

  game.currentRound.continue();
  expect(game.currentPlayer).toEqual(player1);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.steps).toHaveLength(3);
  expect(game.currentRound.currentStep.cards).toHaveLength(0);
  expect(game.currentRound.currentStep.isDone).toEqual(false);

  player1.dropCard(player1.cards[0]);
  expect(game.currentPlayer).toEqual(player2);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.steps).toHaveLength(3);
  expect(game.currentRound.currentStep.cards).toHaveLength(1);
  expect(game.currentRound.currentStep.isDone).toEqual(false);

  player2.dropCard(player2.cards[0]);
  expect(game.currentPlayer).toBeNull();
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toEqual(true);
  expect(game.currentRound.steps).toHaveLength(3);
  expect(game.currentRound.currentStep.cards).toHaveLength(2);
  expect(game.currentRound.currentStep.isDone).toEqual(true);

  expect(() => game.currentRound.continue()).toThrowError();
  game.continue();
  expect(game.players[0].cards).toHaveLength(3);
  expect(game.players[1].cards).toHaveLength(3);
  expect(game.currentPlayer).toEqual(player1);
  expect(game.rounds).toHaveLength(2);
  expect(game.currentRound.isDone).toEqual(false);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toHaveLength(0);
  expect(game.currentRound.currentStep.isDone).toEqual(false);
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
  const [player1, player2] = game.players;
  player1.dropCard(new Card(1, Suit.Hearts));
  expect(() => player1.dropCard(new Card(2, Suit.Hearts))).toThrowError();
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
  ]);

  // game can continue after that
  player2.dropCard(new Card(1, Suit.Clubs));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isHidden: false },
    { card: new Card(1, Suit.Clubs), isHidden: false },
  ]);

  game.currentRound.continue();
  player1.dropCard(new Card(2, Suit.Hearts));
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
