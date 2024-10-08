import type { Card, Game, Player } from "@/types";
import { getElement } from "@/utils/elements";
import { renderCard } from "./card";
import { renderCardBack } from "./cardBack";
import { cardDropped } from "./events";

export function renderOthersCards(game: Game, player: Player) {
  setTimeout(() => {
    const redrawOnAcknowledge = () => {
      redraw(player);
    };
    const redrawOnPick = (event: GlobalEventHandlersEventMap["cardPicked"]) => {
      if (event.detail.player === player) {
        redraw(player, event.detail.card);

        getElement(`ani-${player.id}`).addEventListener("animationend", () => {
          if (game.currentRound.stake.isAccepted !== undefined) {
            dispatchEvent(cardDropped(game, player, event.detail.card));
          }
        });
      }
    };
    const redrawOnDrop = (
      event: GlobalEventHandlersEventMap["cardDropped"],
    ) => {
      if (event.detail.player === player) {
        redraw(player);
      }
    };
    window.addEventListener("roundAcknowledged", redrawOnAcknowledge);
    window.addEventListener("cardPicked", redrawOnPick);
    window.addEventListener("cardDropped", redrawOnDrop);
    window.addEventListener("gameReset", () => {
      window.removeEventListener("roundAcknowledged", redrawOnAcknowledge);
      window.removeEventListener("cardPicked", redrawOnPick);
      window.removeEventListener("cardDropped", redrawOnDrop);
    });
  });
  return `<div class="otc" id="p${player.id}">${render(player)}</div>`;
}

function render(player: Player, pickedCard?: Card) {
  return player.displayCards
    .map((card) => renderPlayerCard(player, card, pickedCard))
    .join(" ");
}

function renderPlayerCard(player: Player, card: Card, pickedCard?: Card) {
  const hasBeenPicked = pickedCard && card.isEqual(pickedCard);
  if (hasBeenPicked) {
    return `<div id="ani-${player.id}" class="otcv">${renderCard(card)}</div>`;
  }
  if (import.meta.env.VITE_DEBUG_OPPONENT_CARDS) {
    return `<div>${renderCard(card)}</div>`;
  }
  return renderCardBack();
}

function redraw(player: Player, pickedCard?: Card) {
  getElement(`p${player.id}`).innerHTML = render(player, pickedCard);
}
