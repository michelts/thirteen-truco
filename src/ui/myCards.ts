import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { renderCard } from "./card";
import { getElement } from "@/utils/getElement";
import { cardDropped } from "./events";

export function renderMyCards(game: Game, player: Player) {
  return `<div id="mc">${render(game, player)}</div>`;
}

function render(game: Game, player: Player) {
  return player.cards
    .map((card) => renderPlayerCard(game, player, card))
    .join(" ");
}

function renderPlayerCard(game: Game, player: Player, card: Card) {
  const id = `mc-${card.cardNumber}-${card.suit}`;
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
  getElement("mc").innerHTML = render(game, player);
}
