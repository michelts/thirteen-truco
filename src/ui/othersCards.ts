import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { getElement } from "@/utils/getElement";
import { renderCard } from "./card";
import { cardDropped } from "./events";

export function renderOthersCards(game: Game, player: Player) {
  return `<div class="mt" id="p${player.id}">${render(game, player)}</div>`;
}

function render(game: Game, player: Player) {
  return player
    .getCards()
    .map((card) => renderPlayerCard(game, player, card))
    .join(" ");
}

function renderPlayerCard(game: Game, player: Player, card: Card) {
  const id = `p${player.id}-${card.cardNumber}-${card.suit}`;
  setTimeout(() => {
    getElement(id).addEventListener("click", () => {
      game.dropCard(player, card);
      redraw(game, player);
      dispatchEvent(cardDropped(game, player, card));
    });
  });
  return `<button id="${id}">${renderCard(card)}</button>`;
}

function redraw(game: Game, player: Player) {
  getElement(`p${player.id}`).innerHTML = render(game, player);
}
