import type { Card } from "@/core";
import type { Game, Player } from "@/types";

declare global {
  interface GlobalEventHandlersEventMap {
    cardPicked: CustomEvent<{ player: Player; card: Card }>;
    cardDropped: CustomEvent<{ game: Game; player: Player; card: Card }>;
  }
}
