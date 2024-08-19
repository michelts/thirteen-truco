import { defaultDeck } from "@/config";
import { Game, Player } from "@/game";
import { renderApp } from "@/ui";
import "@/assets/main.scss";

function runApp() {
  const game = createGame();
  renderApp(game);
}

function createGame() {
  const players = [
    new Player("You"),
    new Player("Molly"),
    new Player("Curtis"),
    new Player("Bret"),
  ];
  return new Game(players, defaultDeck);
}

runApp();
