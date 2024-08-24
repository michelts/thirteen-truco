export function renderScore() {
  const us = 12;
  const them = 7;
  return `<div id="scr">
    <span>SCORE</span>
    <div><div>${us}</div><div>x</div><div>${them}</div></div>
  </div>`;
}
