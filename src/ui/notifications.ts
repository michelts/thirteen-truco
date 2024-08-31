import { getElement } from "@/utils/elements";

let dismissTimeout: ReturnType<typeof setTimeout> | null = null;

export function renderNotifications() {
  window.addEventListener("notificationCreated", (event) => {
    getElement("nf").innerHTML = render(
      event.detail.message,
      event.detail.onDismiss,
    );
    if (event.detail.timeout) {
      dismissTimeout = setTimeout(() => {
        dismiss(event.detail.onDismiss);
      }, event.detail.timeout);
    }
  });
  return '<div id="nf"></div>';
}

function render(message: string, onDismiss?: () => void) {
  setTimeout(() => {
    getElement("nf").firstChild?.addEventListener("click", () =>
      dismiss(onDismiss),
    );
  });
  if (!message) {
    return "";
  }
  return `<button><div>${message}</div></button>`;
}

function dismiss(onDismiss?: () => void) {
  if (dismissTimeout) {
    clearTimeout(dismissTimeout);
  }
  if (onDismiss) {
    onDismiss();
  }
  getElement("nf").innerHTML = render("");
}

export const notifications = {
  weRaisedStakes: (points: number) =>
    `You called ${getRaiseName(points)}! Waiting response...`,
  theyAccepted: "They accepted! Let's continue...",
  theyRejected: "They rejected! The round is yours!",
  weWon: "This round is yours. Congrats!",
  weLost: "You lost this round. No good!",
};

function getRaiseName(points: number) {
  return pointsToWords?.[points] ?? "a raise";
}

const pointsToWords: Record<number, string> = {
  3: "Truco",
  6: "Six",
  9: "Nine",
  12: "Twelve",
};
