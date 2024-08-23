import type { Game } from "@/types";
import { renderCard } from "./card";
import { getElement } from "@/utils/getElement";

export function renderTable(game: Game) {
  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      redraw(event.detail.game);
    });
  });
  return `<div id="t">${render(game)}</div>`;
}

function render(game: Game) {
  return game.currentRound.steps
    .map(
      (step) =>
        `<div>${step.cards
          .map((card) => `<div class="tc">${renderCard(card)}</div>`)
          .join(" ")}</div>`,
    )
    .join("");
}

function redraw(game: Game) {
  getElement("t").innerHTML = render(game);
}
