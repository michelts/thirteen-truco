import type { Game } from "@/types";
import { getElement } from "@/utils/getElement";
import { renderCard } from "./card";
import { renderCardBack } from "./cardBack";
import { cardPlaced } from "./events";

export function renderTableCards(game: Game) {
  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      redraw(event.detail.game);
      getElement("ltc").addEventListener("animationend", () => {
        dispatchEvent(
          cardPlaced(event.detail.game, event.detail.player, event.detail.card),
        );
      });
    });
  });
  return `<div class="t"><div id="t">${render(game)}</div></div>`;
}

function render(game: Game) {
  return game.currentRound.steps
    .map(
      (step, stepIndex) =>
        `<div>${step.cards
          .map((card, cardIndex) => {
            const latestCard =
              stepIndex + 1 === game.currentRound.steps.length &&
              cardIndex + 1 === game.currentRound.currentStep.cards.length;
            return `<div ${latestCard ? 'id="ltc"' : ""} class="tc">${card.isHidden ? renderCardBack() : renderCard(card.card)}</div>`;
          })
          .join(" ")}</div>`,
    )
    .join("");
}

function redraw(game: Game) {
  getElement("t").innerHTML = render(game);
}
