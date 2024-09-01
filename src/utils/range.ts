export function range(count: number, startIndex = 0) {
  return Array(count - startIndex)
    .fill(null)
    .map((_, index) => startIndex + index);
}
