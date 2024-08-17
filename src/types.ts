import type { Card } from "@/core";

export interface Game {
  getPlayers: () => Player[];
  getCurrentRound: () => Round;
  dropCard: (player: Player, card: Card) => void;
}

export interface Round {
  getCurrentStep: () => Step;
}

export interface Step {
  getCards: () => Card[];
}

export interface Player {
  id: number;
  getName: () => string;
  getCards: () => Card[];
}
