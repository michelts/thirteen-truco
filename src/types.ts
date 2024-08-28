import type { Card } from "@/core";

export interface Game {
  players: Player[];
  currentPlayer: Player | null;
  currentRound: Round;
  isDone: boolean;
  continue: () => void;
}

export interface Round {
  turnedCard?: Card;
  steps: Step[];
  currentStep: Step;
  isDone: boolean;
  score?: [number, number];
  continue: () => void;
}

export interface Step {
  cards: StepCard[];
  isDone: boolean;
  addPlayerCard: (player: Player, card: Card, isHidden?: boolean) => void;
}

export interface StepCard {
  card: Card;
  isHidden: boolean;
  isBest: boolean;
}

export interface Player {
  id: number;
  name: string;
  teamIndex: 0 | 1;
  cards: Card[];
  isEqual: (otherPlayer: Player) => boolean;
  autoPickCard?: () => Card;
  dropCard: (card: Card, isHidden?: boolean) => void;
  receiveCards: (cards: Card[]) => void;
}

export type BestCardsFilterFunc = (
  cards: Card[],
  cardsFromHighestToLowest: Card[],
  turnedCard: Card,
) => Card[];
