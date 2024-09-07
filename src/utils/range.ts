export function range(count: number, startIndex = 0) {
  return Array(count)
    .fill(null)
    .map((_, index) => startIndex + index);
}
