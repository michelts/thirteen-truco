import { ElementNotFoundError } from "@/utils/errors";

export function getElement<T = HTMLElement>(id: string): T {
  const element = document.getElementById(id) as T;
  if (!element) {
    throw new ElementNotFoundError();
  }
  return element;
}
