import { type Card, Suit } from "@/core";
import type { Game, Player } from "@/types";

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }
  renderGame();

  function renderGame() {
    root.innerHTML = `${game
      .getPlayers()
      .map((player) => viewPlayer(player))
      .join("")}${viewTable(game)}`;
  }

  function viewPlayer(player: Player) {
    return `
      <div>
        <div>${player.getName()}</div>
        <div>
          ${player
            .getCards()
            .map((card) => viewPlayerCard(player, card))
            .join(" ")}
        </div>
      </div><br/>`;
  }

  function viewTable(game: Game) {
    return `
      <div>
        <div>Table cards:</div>
        <div>
          ${game
            .getCurrentRound()
            .getCurrentStep()
            .getCards()
            .map((card) => viewCard(card))
            .join(" ")}
        </div>
      </div><br />`;
  }

  function viewPlayerCard(player: Player, card: Card) {
    const id = `p${player.id}-${card.cardNumber}-${card.suit}`;
    setTimeout(() => {
      document.getElementById(id).addEventListener("click", () => {
        game.dropCard(player, card);
        renderGame();
      });
    });
    return `<button id="${id}">${viewCard(card)}</button>`;
  }

  function viewCard(card: Card) {
    return `<span>${card.cardNumber} ${suitRepresentation[card.suit]}</span>`;
  }
}

const suitRepresentation = {
  [Suit.Diamonds]: "♦️",
  [Suit.Spades]: "♠️",
  [Suit.Hearts]: "❤️",
  [Suit.Clubs]: "♣️",
};
