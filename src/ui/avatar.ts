import type { Player } from "@/types";

export function renderAvatar(player: Player, index: number | string) {
  return `<div class="av av-${index}"><div><div></div></div><span>${player.name}</span></div>`;
}
