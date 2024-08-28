import type { Game } from "@/types";
import { renderCard } from "./card";
import { getElement } from "@/utils/elements";

export function renderTurnedCard(game: Game) {
  setTimeout(() => {
    window.addEventListener("roundAcknowledged", (event) => {
      redraw(event.detail.game);
    });
  });
  return `<div id="tnc">${render(game)}</div>`;
}

function render(game: Game) {
  return game.turnedCard ? renderCard(game.turnedCard) : "";
}

function redraw(game: Game) {
  getElement("tnc").innerHTML = render(game);
}
