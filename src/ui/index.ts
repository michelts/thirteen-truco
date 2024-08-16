import { type Card, Suit } from "@/core";
import type { Game, Player } from "@/types";

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }
  root.innerHTML = game
    .getPlayers()
    .map((player) => viewPlayer(player))
    .join("");
}

function viewPlayer(player: Player) {
  return `
      <div>
        <div>${player.getName()}</div>
        <ul>
          ${player
            .getCards()
            .map((card) => viewCard(card))
            .join("")}
        </ul>
      </div>`;
}

function viewCard(card: Card) {
  return `<li>${card.cardNumber} (${suitRepresentation[card.suit]})</li>`;
}

const suitRepresentation = {
  [Suit.Diamonds]: "Diamonds",
  [Suit.Spades]: "Spades",
  [Suit.Hearts]: "Hearts",
  [Suit.Clubs]: "Clubs",
};
