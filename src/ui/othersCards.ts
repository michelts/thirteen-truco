import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { getElement } from "@/utils/getElement";
import { renderCard } from "./card";
import { cardDropped } from "./events";

export function renderOthersCards(game: Game, player: Player) {
  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      if (event.detail.player === player) {
        redraw(game, player);
      }
    });
  });
  return `<div class="otc" id="p${player.id}">${render(game, player)}</div>`;
}

function render(game: Game, player: Player) {
  return player.cards
    .map((card) => renderPlayerCard(game, player, card))
    .join(" ");
}

function renderPlayerCard(game: Game, player: Player, card: Card) {
  const id = `p${player.id}-${card.cardNumber}-${card.suit}`;
  setTimeout(() => {
    getElement(id).addEventListener("click", () => {
      dispatchEvent(cardDropped(game, player, card));
    });
  });
  return `<button id="${id}">${renderCard(card)}</button>`;
}

function redraw(game: Game, player: Player) {
  getElement(`p${player.id}`).innerHTML = render(game, player);
}
