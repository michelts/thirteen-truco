import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { getElement } from "@/utils/elements";
import { renderCard } from "./card";
import { renderCardBack } from "./cardBack";
import { cardDropped, stakeRaiseAnswered } from "./events";

export function renderOthersCards(game: Game, player: Player) {
  setTimeout(() => {
    window.addEventListener("roundAcknowledged", () => {
      redraw(player);
    });
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
    let timeoutId: ReturnType<typeof setTimeout>;
    getElement(`p${player.id}`).addEventListener("click", (event) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        if (event.detail === 1) {
          game.currentRound.stake.accept(player);
        } else {
          game.currentRound.stake.reject(player);
        }
        dispatchEvent(stakeRaiseAnswered(game, player));
      }, 200);
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
