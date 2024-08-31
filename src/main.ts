import { getDefaultDeck } from "@/config";
import { autoPickCard, TrucoGame, TrucoPlayer } from "@/games/truco";
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
    new TrucoPlayer(game, "Molly", autoPickCard),
    new TrucoPlayer(game, "Curtis", autoPickCard),
    new TrucoPlayer(game, "Bret", autoPickCard),
  ];
  return game;
}

runApp();
