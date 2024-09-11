import type { Game, Player } from "@/types";
import { getElement } from "@/utils/elements";

export function renderAvatar(
  game: Game,
  player: Player,
  index: number | string,
): string {
  function redraw() {
    getElement(`av-${player.id}`).outerHTML = render(game, player, index);
  }
  window.addEventListener("gameReset", redraw);
  window.addEventListener("cardPlaced", redraw);
  window.addEventListener("stepDone", redraw);
  window.addEventListener("roundDone", redraw);
  window.addEventListener("roundContinued", redraw);
  return render(game, player, index);
}

const render: typeof renderAvatar = (game, player, index) => {
  return `<div id="av-${player.id}" class="av av-${index} ${game.currentRound.currentPlayer?.isEqual(player) ? "av-c" : ""}"><div><div></div></div><span>${player.name}</span></div>`;
};
