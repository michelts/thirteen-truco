export function renderOthers(items: string[]) {
  return `<div id="ot"><div>${items.map((item) => `<div>${item}</div>`).join("")}</div></div>`;
}
