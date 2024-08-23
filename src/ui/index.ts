import type { Game } from "@/types";
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
    renderKitchenTable(renderTableCards(game) + renderCardDeck()) +
    renderMyCards(game, game.players[0]) +
    game.players
      .slice(1)
      .map((player) => renderOthersCards(game, player))
      .join("");
  return;
  root.innerHTML = `
    <div class="hd">
      <h1>13 Truco</h1>
      <div>
        ${renderToggle("Music", false, () => true)}
        ${renderToggle("SFX", false, () => true)}
      </div>
    </div>
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
