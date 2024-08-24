import { defaultDeck } from "@/config";
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
  const game = new TrucoGame(defaultDeck);
  game.players = [
    new HumanPlayer(game, "You"),
    new AutoPlayer(game, "Molly"),
    new HumanPlayer(game, "Curtis"),
    new AutoPlayer(game, "Bret"),
  ];
  return game;
}

runApp();
