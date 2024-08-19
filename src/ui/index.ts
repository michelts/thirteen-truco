import type { Game } from "@/types";
import { renderPlayer } from "./player";
import { renderTable } from "./table";
import { renderToggle } from "./toggle";

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }

  root.innerHTML = `
    <div class="header">
      <h1>13 Truco</h1>
      <div>
        ${renderToggle("Music", false, () => true)}
        ${renderToggle("SFX", false, () => true)}
      </div>
    </div>
    ${game
      .getPlayers()
      .map((player) => renderPlayer(game, player))
      .join("")}
    ${renderTable(game)}`;
}
