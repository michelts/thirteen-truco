import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { getElement } from "@/utils/getElement";
import { renderCard } from "./card";
import { renderCardBack } from "./cardBack";
import { cardDropped } from "./events";

export function renderOthersCards(game: Game, player: Player) {
  setTimeout(() => {
    window.addEventListener("cardPicked", (event) => {
      if (event.detail.player === player) {
        redraw(player, event.detail.card);

        getElement(`ani-${player.id}`).addEventListener("animationend", () => {
          dispatchEvent(cardDropped(game, player, event.detail.card));
        });
      }
    });
    window.addEventListener("cardDropped", (event) => {
      if (event.detail.player === player) {
        redraw(player);
      }
    });
  });
  return `<div class="otc" id="p${player.id}">${render(player)}</div>`;
}

function render(player: Player, pickedCard?: Card) {
  return player.cards
    .map((card) => renderPlayerCard(player, card, pickedCard))
    .join(" ");
}

function renderPlayerCard(player: Player, card: Card, pickedCard?: Card) {
  if (pickedCard && card.isEqual(pickedCard)) {
    return `<div id="ani-${player.id}" class="otcv">${renderCard(card)}</div>`;
  }
  return renderCardBack();
}

function redraw(player: Player, pickedCard?: Card) {
  getElement(`p${player.id}`).innerHTML = render(player, pickedCard);
}
