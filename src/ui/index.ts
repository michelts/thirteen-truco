import type { Game } from "@/types";
import { renderMyCards } from "./myCards";
import { renderTable } from "./table";
import { renderToggle } from "./toggle";
import { renderAvatar, AvatarDirection } from "./avatar";
import { renderOthersCards } from "./othersCards";

export function renderApp(game: Game) {
  const root = document.getElementById("app");
  if (!root) {
    throw new Error("App container not found");
  }

  root.innerHTML = `
    ${table}
  `;
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
      <div class="c cr">${renderOthersCards(game.players[1])}</div>
      <div>${renderAvatar(game.players[1], AvatarDirection.Left)}</div>

      <div class="c ct">${renderOthersCards(game.players[2])}</div>
      <div class="cn">
        table cards<br/>
        ${renderTable(game)}
      </div>
      <div class="c cb">${renderOthersCards(game.players[3])}</div>

      <div>${renderAvatar(game.players[0], AvatarDirection.Bottom)}</div>
      <div>${renderAvatar(game.players[3], AvatarDirection.Top)}</div>

      <div class="me">${renderMyCards(game, game.players[0])}</div>
    </div>
  `;
}

const t1 = `<div class="t1"><div><div></div></div><div><div></div></div></div>`;

const _t1 = `
  <svg width="200" height="200" class="t1">
    <path d="M 0 0 H 200 V 200 H 0 L 0 0" />
  </svg>
`;

const table = `
<div class="table">
  ${t1}
  <div class="t2"></div>
  <div class="t3"></div>
</div>
`;
