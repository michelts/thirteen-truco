import type { Game } from "@/types";
import { getElement } from "@/utils/elements";

export function renderScore(game: Game) {
  window.addEventListener("roundDone", (event) => {
    redraw(event.detail.game);
  });
  return `<div id="scr">${render(game)}</div>`;
}

function render(game: Game) {
  let us = 0;
  let them = 0;
  for (const { score } of game.rounds) {
    us += score?.[0] ?? 0;
    them += score?.[1] ?? 0;
  }
  return `<span>SCORE</span><div><div>${us}</div><div>x</div><div>${them}</div></div>`;
}

function redraw(game: Game) {
  getElement("scr").innerHTML = render(game);
}
