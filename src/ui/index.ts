import type { Game, Player } from "@/types";
import { renderPlayer } from "./player";
import { renderTable } from "./table";
import { renderToggle } from "./toggle";
import { renderAvatar } from "./avatar";
// import { renderOthersCards } from "./othersCards";
//

function renderOthersCards(player: Player) {
  return `cards: ${player.name}`;
}

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }

  root.innerHTML = `
    <div class="hd">
      <h1>13 Truco</h1>
      <div>
        ${renderToggle("Music", false, () => true)}
        ${renderToggle("SFX", false, () => true)}
      </div>
    </div>
    <div class="bd">
      <div>${renderAvatar(game.players[2])}</div>
      <div>${renderOthersCards(game.players[1])}</div>
      <div>${renderAvatar(game.players[1])}</div>

      <div>${renderOthersCards(game.players[2])}</div>
      <div class="tb">
        table cards<br/>
        ${renderTable(game)}
      </div>
      <div>${renderOthersCards(game.players[3])}</div>

      <div>${renderAvatar(game.players[0])}</div>
      <div>${renderAvatar(game.players[3])}</div>

      <div class="me">${renderPlayer(game, game.players[0])}</div>
    </div>
  `;
}
