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
  const player1 = new Player();
  const player2 = new Player();
  new Game([player1, player2], customDeck);
  expect(player1.getCards()).toEqual([
    new Card(1, Suit.Hearts),
    new Card(2, Suit.Hearts),
    new Card(3, Suit.Hearts),
  ]);
  expect(player2.getCards()).toEqual([
    new Card(1, Suit.Clubs),
    new Card(2, Suit.Clubs),
    new Card(3, Suit.Clubs),
  ]);
});
