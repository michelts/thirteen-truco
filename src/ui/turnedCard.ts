import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { renderCard } from "./card";

export function renderTurnedCard(game: Game) {
  setTimeout(() => {
    window.addEventListener("roundAcknowledged", (event) => {
      redraw(event.detail.game);
    });
  });
  return `<div id="tnc">${render(game)}</div>`;
}

function render(game: Game) {
  return game.currentRound.turnedCard
    ? renderCard(game.currentRound.turnedCard)
    : "";
}

function redraw(game: Game) {
  getElement("tnc").innerHTML = render(game);
}
