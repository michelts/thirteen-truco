import type { Card } from "@/core";
import { EmptyHandError } from "@/utils/errors";

export const autoPickCard = (params: {
  hand: Card[];
  trumpCards: Card[];
}) => {
  const card = params.hand[0];
  if (!card) {
    throw new EmptyHandError();
  }
  return { card, isHidden: false };
};
