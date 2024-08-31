import { getDefaultDeck } from "@/config";
import { TrucoGame, TrucoPlayer } from "@/games/truco";
import { renderApp } from "@/ui";
import "@/assets/main.scss";

function runApp() {
  const game = createGame();
  renderApp(game);
}

function createGame() {
  const game = new TrucoGame(getDefaultDeck());
  game.players = [
    new TrucoPlayer(game, "You"),
    new TrucoPlayer(game, "Molly", true),
    new TrucoPlayer(game, "Curtis", true),
    new TrucoPlayer(game, "Bret", true),
  ];
  return game;
}

runApp();
