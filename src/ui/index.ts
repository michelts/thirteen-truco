import type { Game } from "@/types";
import { renderScore } from "./score";
import { renderMyCards } from "./myCards";
import { renderTableCards } from "./tableCards";
import { renderCardDeck } from "./cardDeck";
import { renderToggle } from "./toggle";
import { renderAvatar, AvatarDirection } from "./avatar";
import { renderOthersCards } from "./othersCards";

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }

  setTimeout(() => {
    window.addEventListener("cardDropped", (event) => {
      if (event.detail.game.currentRound.currentStep.isDone) {
        event.detail.game.currentRound.advanceStep();
      }
    });
  });
  root.innerHTML =
    renderHeader(
      renderScore(),
      renderToggle("MUSIC", false, () => true) +
        renderToggle("SFX", false, () => true),
    ) +
    renderKitchenTable(renderTableCards(game) + renderCardDeck()) +
    renderMyCards(game, game.players[0]) +
    game.players
      .slice(1)
      .map((player) => renderOthersCards(game, player))
      .join("");
  return;
  root.innerHTML = `
    <div class="tb">
      <div>${renderAvatar(game.players[2], AvatarDirection.Bottom)}</div>
      <div>${renderAvatar(game.players[1], AvatarDirection.Left)}</div>

      <div class="c ct">${renderOthersCards(game.players[2])}</div>
      <div class="c cb">${renderOthersCards(game.players[3])}</div>

      <div>${renderAvatar(game.players[0], AvatarDirection.Bottom)}</div>
      <div>${renderAvatar(game.players[3], AvatarDirection.Top)}</div>

    </div>
  `;
}

function renderHeader(left: string, right: string) {
  return `<div class="hd"><div>${left}</div><div>${right}</div></div>`;
}

function renderKitchenTable(content: string) {
  return `
  <div class="tbg">
    <div class="t1"></div>
    <div class="t2"></div>
    <div class="t3"></div>
    ${content}
  </div>
`;
}
