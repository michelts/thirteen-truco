import { getDefaultDeck } from "@/config";
import { TrucoGame } from "@/games/truco";
import { AutoPlayer } from "@/players/auto";
import { HumanPlayer } from "@/players/human";
import { renderApp } from "@/ui";
import "@/assets/main.scss";

function runApp() {
  const game = createGame();
  renderApp(game);
}

function createGame() {
  const game = new TrucoGame(getDefaultDeck());
  game.players = [
    new HumanPlayer(game, "You"),
    new AutoPlayer(game, "Molly"),
    new AutoPlayer(game, "Curtis"),
    new AutoPlayer(game, "Bret"),
  ];
  return game;
}

runApp();
