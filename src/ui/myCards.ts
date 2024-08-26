import type { Card } from "@/core";
import type { Game, Player } from "@/types";
import { getElement } from "@/utils/getElement";
import { renderCard } from "./card";
import { cardDropped } from "./events";

export function renderMyCards(game: Game, player: Player) {
  setTimeout(() => {
    window.addEventListener("roundDone", () => {
      redraw(game, player);
    });
    window.addEventListener("cardDropped", (event) => {
      if (event.detail.player === player) {
        redraw(game, player);
      }
    });
  });
  return `<div id="mc">${render(game, player)}</div>`;
}

function render(game: Game, player: Player) {
  return player.cards
    .map((card) => renderPlayerCard(game, player, card))
    .join(" ");
}

function renderPlayerCard(game: Game, player: Player, card: Card) {
  const id = `mc-${card.cardNumber}-${card.suit}`;
  setTimeout(() => listenToCardEvents(game, player, card, id));
  return `<button id="${id}">${renderCard(card)}</button>`;
}

function redraw(game: Game, player: Player) {
  getElement("mc").innerHTML = render(game, player);
}

function listenToCardEvents(
  game: Game,
  player: Player,
  card: Card,
  id: string,
) {
  let isDragging = false;
  let originalX = 0;
  let originalY = 0;
  let newLeft = 0;
  let newTop = 0;
  const element = getElement(id);
  const rect = element.getBoundingClientRect();

  function dragStart(event: { clientX: number; clientY: number }) {
    isDragging = true;
    originalX = event.clientX;
    originalY = event.clientY;
  }

  function dragMove(event: { clientX: number; clientY: number }) {
    if (!isDragging) {
      return;
    }
    newLeft = event.clientX - originalX;
    newTop = event.clientY - originalY;
    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
  }

  function dragCancel() {
    isDragging = false;
    newLeft = 0;
    newTop = 0;
    element.style.top = "0";
    element.style.left = "0";
  }

  function dragEnd() {
    // Drop or discard card if dragged completely out of initial top and bottom limits
    if (newTop < -1 * rect.height) {
      dispatchEvent(cardDropped(game, player, card));
    } else if (newTop > rect.height) {
      const isHidden = true;
      dispatchEvent(cardDropped(game, player, card, isHidden));
    }
    dragCancel();
  }

  element.addEventListener("mousedown", (event) => dragStart(event));
  element.addEventListener("touchstart", (event) =>
    dragStart(event.touches[0]),
  );

  element.addEventListener("mousemove", (event) => dragMove(event));
  element.addEventListener("touchmove", (event) => dragMove(event.touches[0]));

  element.addEventListener("mouseout", dragCancel);
  element.addEventListener("touchcancel", dragCancel);

  element.addEventListener("mouseup", dragEnd);
  element.addEventListener("touchend", dragEnd);
}
