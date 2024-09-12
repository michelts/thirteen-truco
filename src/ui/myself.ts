import type { Game } from "@/types";
import { getElement } from "@/utils/elements";
import { renderActions } from "./actions";
import { renderAvatar } from "./avatar";
import { renderMyCards } from "./myCards";
import { renderNotifications } from "./notifications";

export function renderMyself(game: Game) {
  window.addEventListener("gameReset", (event) => {
    getElement("me").innerHTML = render(event.detail.game);
  });
  return `<div id="me">${render(game)}</div>`;
}

function render(game: Game) {
  return `<div>${
    renderMyCards(game, game.players[0]) +
    renderAvatar(game, game.players[0], "y") +
    renderActions(game) +
    renderNotifications()
  }</div>`;
}
