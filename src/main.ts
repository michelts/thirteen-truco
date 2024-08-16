import { defaultDeck } from "@/config";
import { Game, Player } from "@/game";
import { renderApp } from "@/ui";

function runApp() {
  const game = createGame();
  renderApp(game);
}

function createGame() {
  const players = [new Player("Danny Ocean"), new Player("Linus Caldwell")];
  return new Game(players, defaultDeck);
}

runApp();
