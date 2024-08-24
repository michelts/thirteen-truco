import type { Player } from "@/types";

export function renderAvatar(player: Player, index: number) {
  return `<div class="av av-${index}"><div><div></div></div><span>${player.name}</span></div>`;
}
