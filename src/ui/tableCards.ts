import type { Game, StepCard } from "@/types";
import { getElement, findElement } from "@/utils/elements";
import { renderCard } from "./card";
import { renderCardBack } from "./cardBack";
import { cardPlaced, roundAcknowledged } from "./events";

export function renderTableCards(game: Game) {
  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      redraw(event.detail.game);
      findElement(".ltc").addEventListener("animationend", () => {
        dispatchEvent(
          cardPlaced(event.detail.game, event.detail.player, event.detail.card),
        );
      });
    });
    window.addEventListener("roundDone", (event) => {
      redraw(event.detail.game, true);
      let hasBeenDispatched = false;
      findElement(".btc").addEventListener("animationend", () => {
        if (!hasBeenDispatched) {
          dispatchEvent(roundAcknowledged(event.detail.game));
          hasBeenDispatched = true;
        }
      });
    });
    window.addEventListener("roundAcknowledged", (event) => {
      redraw(event.detail.game);
    });
  });
  return `<div class="t"><div id="t">${render(game)}</div></div>`;
}

function render(game: Game, showBestCards?: boolean) {
  return game.currentRound.steps
    .map((step, stepIndex) => {
      return `<div>${step.cards
        .map((stepCard, cardIndex) => {
          const isLatestCard =
            !showBestCards &&
            stepIndex + 1 === game.currentRound.steps.length &&
            cardIndex + 1 === game.currentRound.currentStep.cards.length;
          const isBestCard = showBestCards && stepCard.isBest;
          return renderTableCard(stepCard, [
            isLatestCard ? "ltc" : "",
            isBestCard ? "btc" : "",
          ]);
        })
        .join(" ")}</div>`;
    })
    .join("");
}

function redraw(game: Game, showBestCards?: boolean) {
  getElement("t").innerHTML = render(game, showBestCards);
}

function renderTableCard(stepCard: StepCard, classNames: string[]) {
  return `<div class="tc ${classNames.join(" ")}">
      ${stepCard.isHidden ? renderCardBack() : renderCard(stepCard.card)}
    </div>`;
}
