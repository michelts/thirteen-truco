export function renderOthers(items: string[]) {
  return `<div id="ot"><div>${items
    .reverse() // reverse so game runs clockwise
    .map((item) => `<div>${item}</div>`)
    .join("")}</div></div>`;
}
