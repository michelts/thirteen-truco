import type { Game } from "@/types";
import { getElement } from "@/utils/elements";

export function renderScore(game: Game) {
  window.addEventListener("roundAcknowledged", (event) => {
    redraw(event.detail.game);
  });
  return `<div id="scr">${render(game)}</div>`;
}

function render(game: Game) {
  const [us, them] = game.score;
  return `<span>SCORE</span><div><div>${us}</div><div>x</div><div>${them}</div></div>`;
}

function redraw(game: Game) {
  getElement("scr").innerHTML = render(game);
}
