import type { Card } from "@/core";

export interface Game {
  getPlayers: () => Player[];
}

export interface Player {
  getName: () => string;
  getCards: () => Card[];
}
