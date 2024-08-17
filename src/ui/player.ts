import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { renderCard } from "./card";

export function renderPlayer(game: Game, player: Player) {
  return `
      <div>
        <div>${player.getName()}</div>
        <div>
          ${player
            .getCards()
            .map((card) => renderPlayerCard(game, player, card))
            .join(" ")}
        </div>
      </div><br/>`;
}

function renderPlayerCard(game: Game, player: Player, card: Card) {
  const id = `p${player.id}-${card.cardNumber}-${card.suit}`;
  setTimeout(() => {
    document.getElementById(id).addEventListener("click", () => {
      game.dropCard(player, card);
    });
  });
  return `<button id="${id}">${renderCard(card)}</button>`;
}
