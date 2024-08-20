import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { renderCard } from "./card";
import { getElement } from "@/utils/getElement";
import { cardDropped } from "./events";

export function renderMyCards(game: Game, player: Player) {
  return render(game, player);
}

function render(game: Game, player: Player) {
  return `
      <div id="p${player.id}">
        ${player
          .getCards()
          .map((card) => renderPlayerCard(game, player, card))
          .join(" ")}
      </div>`;
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
