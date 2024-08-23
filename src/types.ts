import type { Card } from "@/core";

export interface Game {
  players: Player[];
  currentRound: Round;
  dropCard: (player: Player, card: Card) => void;
}

export interface Round {
  steps: Step[];
  currentStep: Step;
}

export interface Step {
  cards: Card[];
}

export interface Player {
  id: number;
  name: string;
  cards: Card[];
}
