import { getElement } from "@/utils/elements";

export function renderNotifications() {
  window.addEventListener("notificationCreated", (event) => {
    getElement("nf").innerHTML = render(event.detail.message);
  });
  return '<div id="nf"></div>';
}

function render(message: string) {
  return `<div><div>${message}</div></div>`;
}

export const notifications = {
  weRaisedStakes: (points: keyof typeof pointsToWords) =>
    `You called ${pointsToWords[points]}! Waiting response...`,
};

const pointsToWords = {
  3: "Truco",
  6: "Six",
  9: "Nine",
  12: "Twelve",
};
