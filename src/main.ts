import { type Card, Suit } from "@/core";
import { Game, Player } from "@/game";
import { defaultDeck } from "@/config";

function runApp() {
  listenToEvents();
  renderApp();
}

function renderApp() {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }
  const players = [new Player("Danny Ocean"), new Player("Linus Caldwell")];
  new Game(players, defaultDeck);
  root.innerHTML = players.map((player) => viewPlayer(player)).join("");
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

function listenToEvents() {}

runApp();
