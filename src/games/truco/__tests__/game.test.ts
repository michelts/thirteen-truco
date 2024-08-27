import type { SetRequired } from "type-fest";
import type { Step, StepCard } from "@/types";
import { Card, Deck, Suit } from "@/core";
import { TrucoPlayer } from "@/players";
import { expect, it, vi } from "vitest";
import { TrucoGame } from "../index";

const cards = [
  new Card(1, Suit.Hearts),
  new Card(2, Suit.Hearts),
  new Card(3, Suit.Hearts),
  new Card(1, Suit.Clubs),
  new Card(2, Suit.Clubs),
  new Card(3, Suit.Clubs),
  new Card(4, Suit.Hearts),
  new Card(5, Suit.Hearts),
  new Card(6, Suit.Hearts),
  new Card(4, Suit.Clubs),
  new Card(5, Suit.Clubs),
  new Card(6, Suit.Clubs),
];

const directOrderDeck = new Deck(cards, (cards) => cards);

const reverseOrderDeck = new Deck(cards, (cards) => cards.reverse());

it("should shuffle the deck and give 3 distinct cards to each player", () => {
  const game = new TrucoGame(reverseOrderDeck);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  expect(game.players[0].cards).toEqual([
    new Card(6, Suit.Clubs),
    new Card(5, Suit.Clubs),
    new Card(4, Suit.Clubs),
  ]);
  expect(game.players[1].cards).toEqual([
    new Card(6, Suit.Hearts),
    new Card(5, Suit.Hearts),
    new Card(4, Suit.Hearts),
  ]);
});

it("should allow player to drop cards on the table", () => {
  const game = new TrucoGame(directOrderDeck);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  const [player1, player2] = game.players;
  player1.dropCard(new Card(1, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts) },
  ]);
  player2.dropCard(new Card(1, Suit.Clubs));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts) },
    { card: new Card(1, Suit.Clubs) },
  ]);

  game.currentRound.continue();
  player1.dropCard(new Card(2, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(2, Suit.Hearts) },
  ]);
  player2.dropCard(new Card(2, Suit.Clubs));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(2, Suit.Hearts) },
    { card: new Card(2, Suit.Clubs) },
  ]);
});

it("should fill rounds, steps and score as players drop cards", () => {
  const game = new TrucoGame(directOrderDeck); // use a deck with enough cards
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  const [player1, player2] = game.players;
  expect(game.currentPlayer).toEqual(game.players[0]);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toEqual([]);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.currentStep.isDone).toBe(false);

  player1.dropCard(new Card(1, Suit.Hearts));
  expect(game.currentPlayer).toEqual(player2);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toHaveLength(1);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.currentStep.isDone).toBe(false);

  player2.dropCard(new Card(1, Suit.Clubs));
  expect(game.currentPlayer).toBeNull(); // because step is done
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toHaveLength(2);
  expect(game.currentRound.currentStep.isDone).toBe(true);

  game.currentRound.continue(); // Has to explicitly continue game
  expect(game.currentPlayer).toEqual(player1);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.steps).toHaveLength(2);
  expect(game.currentRound.currentStep.cards).toHaveLength(0);
  expect(game.currentRound.currentStep.isDone).toBe(false);

  player1.dropCard(new Card(2, Suit.Hearts));
  expect(game.currentPlayer).toEqual(player2);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.steps).toHaveLength(2);
  expect(game.currentRound.currentStep.cards).toHaveLength(1);
  expect(game.currentRound.currentStep.isDone).toBe(false);

  player2.dropCard(new Card(2, Suit.Clubs));
  expect(game.currentPlayer).toBeNull();
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.steps).toHaveLength(2);
  expect(game.currentRound.currentStep.cards).toHaveLength(2);
  expect(game.currentRound.currentStep.isDone).toBe(true);

  game.currentRound.continue();
  expect(game.currentPlayer).toEqual(player1);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.steps).toHaveLength(3);
  expect(game.currentRound.currentStep.cards).toHaveLength(0);
  expect(game.currentRound.currentStep.isDone).toBe(false);

  player1.dropCard(new Card(3, Suit.Hearts));
  expect(game.currentPlayer).toEqual(player2);
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.steps).toHaveLength(3);
  expect(game.currentRound.currentStep.cards).toHaveLength(1);
  expect(game.currentRound.currentStep.isDone).toBe(false);

  player2.dropCard(new Card(3, Suit.Clubs));
  expect(game.currentPlayer).toBeNull();
  expect(game.rounds).toHaveLength(1);
  expect(game.currentRound.isDone).toBe(true);
  expect(game.currentRound.steps).toHaveLength(3);
  expect(game.currentRound.currentStep.cards).toHaveLength(2);
  expect(game.currentRound.currentStep.isDone).toBe(true);

  expect(() => game.currentRound.continue()).toThrowError();
  game.continue();
  expect(game.players[0].cards).toHaveLength(3);
  expect(game.players[1].cards).toHaveLength(3);
  expect(game.currentPlayer).toEqual(player1);
  expect(game.rounds).toHaveLength(2);
  expect(game.currentRound.isDone).toBe(false);
  expect(game.currentRound.steps).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toHaveLength(0);
  expect(game.currentRound.currentStep.isDone).toBe(false);
});

it("should indicate best cards when step is done", () => {
  const bestCards = [new Card(1, Suit.Hearts), new Card(4, Suit.Hearts)];
  const filterBestCards = vi.fn().mockReturnValue(bestCards);
  const game = new TrucoGame(directOrderDeck, filterBestCards);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
    new TrucoPlayer(game, "Rick"),
    new TrucoPlayer(game, "Lester"),
  ];
  const [player1, player2, player3, player4] = game.players;
  player1.dropCard(new Card(1, Suit.Hearts));
  player2.dropCard(new Card(2, Suit.Clubs), true);
  player3.dropCard(new Card(4, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isBest: false },
    { card: new Card(2, Suit.Clubs), isHidden: true, isBest: false },
    { card: new Card(4, Suit.Hearts), isBest: false },
  ]);

  player4.dropCard(new Card(6, Suit.Clubs));
  expect(game.currentRound.currentStep.isDone).toBe(true);
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts), isBest: true },
    { card: new Card(2, Suit.Clubs), isHidden: true, isBest: false },
    { card: new Card(4, Suit.Hearts), isBest: true },
    { card: new Card(6, Suit.Clubs), isBest: false },
  ]);
  expect(filterBestCards).toHaveBeenCalledWith(
    [
      new Card(1, Suit.Hearts),
      new Card(4, Suit.Hearts),
      new Card(6, Suit.Clubs),
    ],
    directOrderDeck,
  );
});

it("should allow player to drop card as hidden", () => {
  const game = new TrucoGame(directOrderDeck);
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
  const game = new TrucoGame(directOrderDeck);
  game.players = [
    new TrucoPlayer(game, "Jack"),
    new TrucoPlayer(game, "Curtis"),
  ];
  const [player1, player2] = game.players;
  player1.dropCard(new Card(1, Suit.Hearts));
  expect(() => player1.dropCard(new Card(2, Suit.Hearts))).toThrowError();
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts) },
  ]);

  // game can continue after that
  player2.dropCard(new Card(2, Suit.Clubs));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(1, Suit.Hearts) },
    { card: new Card(2, Suit.Clubs) },
  ]);

  game.currentRound.continue();
  player1.dropCard(new Card(2, Suit.Hearts));
  assertStepHasCards(game.currentRound.currentStep, [
    { card: new Card(2, Suit.Hearts) },
  ]);
});

function assertStepHasCards(
  step: Step,
  expectedCards: SetRequired<Partial<StepCard>, "card">[],
) {
  expect(step.cards).toHaveLength(expectedCards.length);
  step.cards.forEach((card, index) => {
    expect(card).toMatchObject({
      isHidden: false,
      isBest: expect.any(Boolean),
      ...expectedCards[index],
    });
  });
}
