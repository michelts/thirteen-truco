import type { Player } from "@/types";

export function renderAvatar(player: Player, index: number | string) {
  return `<div class="av"><div><div class="av-${index}"></div></div><span>${player.name}</span></div>`;
}
