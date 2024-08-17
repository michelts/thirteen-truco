import type { Game } from "@/types";
import { renderCard } from "./card";
import { getElement } from "@/utils/getElement";

export function renderTable(game: Game) {
  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      redraw(event.detail.game);
    });
  });
  return render(game);
}

function render(game: Game) {
  return `
      <div id="t">
        <div>Table cards:</div>
        <div>
          ${game
            .getCurrentRound()
            .getCurrentStep()
            .getCards()
            .map((card) => renderCard(card))
            .join(" ")}
        </div>
      </div><br />`;
}

function redraw(game: Game) {
  getElement("t").innerHTML = render(game);
}
