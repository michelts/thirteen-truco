import { getElement } from "@/utils/getElement";
import { getId } from "@/utils/getId";

export function renderToggle(
  label: string,
  defaultIsOn: boolean,
  onClick: () => boolean,
) {
  const id = `tg-${getId()}`;
  setTimeout(() => {
    const button = getElement(id);
    button.addEventListener("click", () => {
      const newState = onClick();
      button.classList.remove("on", "off");
      button.classList.add(newState ? "on" : "off");
    });
  });
  return `
    <button type="button" id="${id}" class="tg ${defaultIsOn ? "on" : "off"}">
      <span>${label}</span>
      <div></div>
    </button>`;
}
