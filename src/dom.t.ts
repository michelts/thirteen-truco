import type { Card } from "@/core";
import type { Game, Player } from "@/types";

declare global {
  interface GlobalEventHandlersEventMap {
    cardDropped: CustomEvent<{ game: Game; player: Player; card: Card }>;
  }
}
