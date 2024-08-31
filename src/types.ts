import type { Card } from "@/core";

export interface Game {
  players: Player[];
  currentPlayer: Player | null;
  rounds: Round[];
  currentRound: Round;
  isDone: boolean;
  continue: () => void;
  score: [number, number];
}

export interface Round {
  turnedCard?: Card;
  steps: Step[];
  currentStep: Step;
  isDone: boolean;
  continue: () => void;
  score?: [number, number];
  stake: Stake;
  raiseStake: (player: Player) => void;
  nextStakePoints: 3 | 6 | 9 | 12;
}

export interface Stake {
  points: number;
  raisedBy: Player;
  acceptedBy: Player[];
  rejectedBy: Player[];
  accept: (player: Player) => void;
  reject: (player: Player) => void;
  isAccepted: boolean | undefined;
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
