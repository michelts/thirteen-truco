import { ElementNotFoundError } from "@/utils/errors";

export function getElement<T = HTMLElement>(id: string): T {
  const element = document.getElementById(id) as T;
  if (!element) {
    throw new ElementNotFoundError();
  }
  return element;
}

export function findElement<T = HTMLElement>(query: string): T {
  const element = document.querySelector(query) as T;
  if (!element) {
    throw new ElementNotFoundError();
  }
  return element;
}
