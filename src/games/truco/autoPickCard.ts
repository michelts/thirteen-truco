import type { AutoPickCardFunc } from "@/types";
import { EmptyHandError } from "@/utils/errors";

export const autoPickCard: AutoPickCardFunc = (params) => {
  const card = params.hand[0];
  if (!card) {
    throw new EmptyHandError();
  }
  return { card, isHidden: false };
};
