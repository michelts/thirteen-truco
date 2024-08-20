import type { Player } from "@/types";

export enum AvatarDirection {
  Left = "l",
  Top = "t",
  Bottom = "b",
}
export function renderAvatar(player: Player, direction: AvatarDirection) {
  return `<div class="av ${direction}"><div></div><span>${player.name}</span></div>`;
}
