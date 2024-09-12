import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { renderAvatar } from "./avatar";
import { renderOthersCards } from "./othersCards";
import { renderPlayer } from "./player";

export function renderOthers(game: Game) {
  setTimeout(() => {
    window.addEventListener("gameReset", (event) => {
      getElement("ot").innerHTML = render(event.detail.game);
    });
  });
  return `<div id="ot">${render(game)}</div>`;
}

function render(game: Game) {
  const items = game.players
    .slice(1)
    .map((player, index) =>
      renderPlayer(
        renderAvatar(game, player, index),
        renderOthersCards(game, player),
      ),
    );
  return `<div>${items
    .reverse() // reverse so game runs clockwise
    .map((item) => `<div>${item}</div>`)
    .join("")}</div>`;
}
