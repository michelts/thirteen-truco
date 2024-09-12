export enum Suit {
  Diamonds = 1,
  Spades = 2,
  Hearts = 3,
  Clubs = 4,
}

export interface Card {
  cardNumber: number;
  suit: Suit;
  mimicable: boolean;
  isEqual: (card: Card) => boolean;
}

export interface Deck {
  cardsFromLowestToHighest: Card[];
  shuffledCards: Card[];
  shuffleFunc: (cards: Card[]) => Card[];
  shuffle: () => void;
  getCard: () => Card;
}

export interface Player {
  id: number;
  name: string;
  teamIndex: 0 | 1;
  cards: Card[];
  displayCards: Card[];
  isEqual: (otherPlayer: Player) => boolean;
  isPendingTurn: boolean;
  canAutoPickCard: boolean;
  receiveCards: (cards: PlayerCard[]) => void;
  autoPickCard: () => {
    card: Card;
    isHidden: boolean;
    shouldRaise: boolean;
  };
  dropCard: (card: Card, isHidden?: boolean) => void;
}

export interface PlayerCard {
  card: Card;
  displayCard: Card;
  isMimic: boolean;
}

export interface Game {
  deck: Deck;
  players: Player[];
  rounds: Round[];
  currentRound: Round;
  isDone: boolean;
  continue: () => void;
  reset: (players?: Player[]) => void;
  score: [number, number];
}

export interface Round {
  turnedCard?: Card;
  trumpCards: Card[];
  initialPlayer: Player;
  currentPlayer: Player | null;
  steps: Step[];
  currentStep: Step;
  isDone: boolean;
  continue: () => void;
  stake: Stake;
  raiseStake: (player: Player) => void;
  previousStakePoints: number;
  currentStakePoints: number;
  nextStakePoints: number;
  score?: [number, number];
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
  winner?: Player;
  addPlayerCard: (player: Player, card: Card, isHidden?: boolean) => void;
}

export interface StepCard {
  player: Player;
  card: Card;
  isHidden: boolean;
  isBest: boolean;
}

export type BestCardsFilterFunc = (
  cards: Card[],
  cardsFromHighestToLowest: Card[],
  trumpCardNumber: number,
) => Card[];

// biome-ignore lint/suspicious/noExplicitAny: not trying to type soundbox's CPlayer
export type AudioBoxSound = any;
