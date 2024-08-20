import type { Player } from "@/types";

export function renderAvatar(player: Player) {
  return `<div class="av"><div></div><span>${player.name}</span></div>`;
}
