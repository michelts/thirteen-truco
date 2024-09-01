import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { renderCard } from "./card";

export function renderTurnedCard(game: Game) {
  setTimeout(() => {
    const redraw = () => {
      getElement("tnc").innerHTML = render(game);
    };
    window.addEventListener("gameReset", redraw);
    window.addEventListener("roundAcknowledged", redraw);
  });
  return `<div id="tnc">${render(game)}</div>`;
}

function render(game: Game) {
  return game.currentRound.turnedCard
    ? renderCard(game.currentRound.turnedCard)
    : "";
}
