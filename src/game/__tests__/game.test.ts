import { Card, Deck, Suit } from "@/core";
import { Game, Player } from "@/game";
import { expect, it } from "vitest";

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
  const player1 = new Player("A");
  const player2 = new Player("B");
  new Game([player1, player2], customDeck);
  expect(player1.cards).toEqual([
    new Card(1, Suit.Hearts),
    new Card(2, Suit.Hearts),
    new Card(3, Suit.Hearts),
  ]);
  expect(player2.cards).toEqual([
    new Card(1, Suit.Clubs),
    new Card(2, Suit.Clubs),
    new Card(3, Suit.Clubs),
  ]);
});

it("should allow player to drop cards on the table", () => {
  const player1 = new Player("A");
  const player2 = new Player("B");
  const game = new Game([player1, player2], customDeck);
  expect(game.getRounds()).toHaveLength(1);
  expect(game.currentRound.getSteps()).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toEqual([]);

  game.dropCard(player1, new Card(1, Suit.Hearts));
  expect(game.getRounds()).toHaveLength(1);
  expect(game.currentRound.getSteps()).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toEqual([
    new Card(1, Suit.Hearts),
  ]);

  game.dropCard(player2, new Card(1, Suit.Clubs));
  expect(game.getRounds()).toHaveLength(1);
  expect(game.currentRound.getSteps()).toHaveLength(1);
  expect(game.currentRound.currentStep.cards).toEqual([
    new Card(1, Suit.Hearts),
    new Card(1, Suit.Clubs),
  ]);
});
