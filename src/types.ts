import type { Card, Deck } from "@/core";

export interface Game {
  deck: Deck;
  players: Player[];
  currentPlayer: Player | null;
  passToNextPlayer: () => void;
  currentRound: Round;
}

export interface Round {
  steps: Step[];
  currentStep: Step;
  advanceStep: () => void;
}

export interface Step {
  cards: StepCard[];
  isDone: boolean;
  addPlayerCard: (player: Player, card: Card, isHidden?: boolean) => void;
}

export interface StepCard {
  card: Card;
  isHidden: boolean;
}

export interface Player {
  id: number;
  name: string;
  cards: Card[];
  autoPickCard?: () => Card;
  dropCard: (card: Card, isHidden?: boolean) => void;
  receiveCards: (cards: Card[]) => void;
}
