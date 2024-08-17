export function getElement<T = HTMLElement>(id: string): T {
  const element = document.getElementById(id) as T;
  if (!element) {
    throw new Error(`Missing #${id}`);
  }
  return element;
}
