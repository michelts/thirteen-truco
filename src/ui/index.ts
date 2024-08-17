import type { Game } from "@/types";
import { renderPlayer } from "./player";
import { renderTable } from "./table";

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }

  root.innerHTML = `${game
    .getPlayers()
    .map((player) => renderPlayer(game, player))
    .join("")}${renderTable(game)}`;
}
