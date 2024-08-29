export function shuffle<T>(items: T[]) {
  const shuffleItems = [...items];
  let currentIndex = items.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // swap positions
    [items[currentIndex], items[randomIndex]] = [
      items[randomIndex],
      items[currentIndex],
    ];
  }
  return shuffleItems;
}
