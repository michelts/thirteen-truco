import { getElement } from "@/utils/elements";
import { getId } from "@/utils/getId";

export function renderToggle(label: string, onClick: () => Promise<boolean>) {
  const key = `13-truco-tgl-${label}`;
  const defaultIsOn = window.localStorage.getItem(key) ?? "on";
  const id = `tg-${getId()}`;
  setTimeout(() => {
    const button = getElement(id);
    button.addEventListener("click", async () => {
      const newState = await onClick();
      window.localStorage.setItem(key, newState ? "on" : "off");
      button.classList.remove("on", "off");
      button.classList.add(newState ? "on" : "off");
      console.log(window.localStorage.getItem(key));
    });
  });
  return `
    <button type="button" id="${id}" class="tg ${defaultIsOn}">
      <span>${label}</span>
      <div></div>
    </button>`;
}
