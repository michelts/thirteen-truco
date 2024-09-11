import type { Card, Game, Player } from "@/types";
import {
  CardNotFoundError,
  NotEnoughCardsError,
  NotYourTurnError,
  PendingStakeRaiseError,
  PlayerNotInitializedError,
} from "@/utils/errors";
import { getId } from "@/utils/getId";
import { autoPickCard } from "./autoPickCard";

interface TrucoPlayerType {
  receiveCards: (playerCards: PlayerCard[]) => void;
}

export class TrucoPlayer implements Player, TrucoPlayerType {
  public canAutoPickCard: boolean;
  private _game: Game;
  private _id: ReturnType<typeof getId>;
  private _name = "";
  private _teamIndex?: Player["teamIndex"];
  private _cards: PlayerCard[] = [];

  constructor(game: Game, name: string, canAutoPickCard?: boolean) {
    this._id = getId();
    this._name = name;
    this._game = game;
    this.canAutoPickCard = canAutoPickCard ?? false;
  }

  isEqual(player: Player) {
    return this.id === player.id;
  }

  toString() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get teamIndex() {
    if (this._teamIndex === undefined) {
      throw new PlayerNotInitializedError();
    }
    return this._teamIndex;
  }

  set teamIndex(index: Player["teamIndex"]) {
    this._teamIndex = index;
  }

  receiveCards(cards: PlayerCard[]) {
    if (cards.length !== 3) {
      throw new NotEnoughCardsError();
    }
    this._cards = cards;
  }

  get cards() {
    return this._cards.map((playerCard) => playerCard.card);
  }

  get displayCards() {
    return this._cards.map((playerCard) => playerCard.displayCard);
  }

  get isPendingTurn() {
    if (this._game.currentRound.stake.isAccepted === undefined) {
      return false;
    }
    const stepsCount = this._game.currentRound.steps.length;
    const cardsCount = this.cards.length;
    return cardsCount + stepsCount > 3;
  }

  dropCard(card: Card, isHidden?: boolean) {
    if (this._game.currentRound.stake.isAccepted === undefined) {
      throw new PendingStakeRaiseError();
    }
    if (this._game.currentRound.currentPlayer?.isEqual(this)) {
      const foundCard = this.takeCard(card);
      this._game.currentRound.currentStep.addPlayerCard(
        this,
        foundCard.card,
        isHidden,
      );
    } else {
      throw new NotYourTurnError();
    }
  }

  takeCard(takenCard: Card) {
    const cardIndex = this.displayCards.findIndex((card) =>
      card.isEqual(takenCard),
    );
    if (cardIndex === -1) {
      throw new CardNotFoundError();
    }
    const [foundCard] = this._cards.splice(cardIndex, 1);
    return foundCard;
  }

  autoPickCard() {
    const previousFromOurs = this._game.currentRound.steps.map((step) =>
      step.cards
        .filter((stepCard) => stepCard.player.teamIndex === 0)
        .map((stepCard) => stepCard.card),
    );
    const previousFromTheirs = this._game.currentRound.steps.map((step) =>
      step.cards
        .filter((stepCard) => stepCard.player.teamIndex === 1)
        .map((stepCard) => stepCard.card),
    );
    return autoPickCard(
      this.displayCards,
      previousFromOurs,
      previousFromTheirs,
      this._game.currentRound.steps.map((step) =>
        step.winner ? step.winner.teamIndex === this.teamIndex : undefined,
      ),
      this._game.currentRound.trumpCards,
      this._game.deck.cardsFromLowestToHighest,
    );
  }
}

export class PlayerCard {
  public card: Card;
  private _realCard?: Card;

  constructor(card: Card, realCard?: Card) {
    this.card = card;
    this._realCard = realCard;
  }

  get displayCard() {
    return this._realCard ?? this.card;
  }

  get isMimic() {
    return this._realCard !== undefined;
  }
}
