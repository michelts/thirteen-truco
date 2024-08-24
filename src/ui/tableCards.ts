import type { Game } from "@/types";
import { getElement } from "@/utils/getElement";
import { renderCard } from "./card";

export function renderTableCards(game: Game) {
  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      redraw(event.detail.game);
    });
  });
  return `<div class="t"><div id="t">${render(game)}</div></div>`;
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
