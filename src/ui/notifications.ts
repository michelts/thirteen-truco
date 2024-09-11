import { getElement } from "@/utils/elements";

let dismissTimeout: ReturnType<typeof setTimeout> | null = null;

let currentMessage = "";

export function renderNotifications() {
  window.addEventListener("notificationCreated", (event) => {
    getElement("nf").innerHTML = render(
      event.detail.message,
      event.detail.onDismiss,
      !event.detail.timeout,
    );
    if (event.detail.timeout) {
      dismissTimeout = setTimeout(() => {
        dismiss(event.detail.onDismiss, event.detail.message);
      }, event.detail.timeout);
    }
  });
  window.addEventListener("gameReset", () => {
    getElement("nf").innerHTML = render("");
    currentMessage = "";
  });
  return '<div id="nf"></div>';
}

function render(message: string, onDismiss?: () => void, dismissable = true) {
  currentMessage = message;
  setTimeout(() => {
    getElement("nf").firstChild?.addEventListener("click", () =>
      dismiss(onDismiss, message),
    );
  });
  if (!message) {
    return "";
  }
  return `<button ${dismissable ? 'class="dms"' : ""}><div>${message}</div></button>`;
}

function dismiss(onDismiss?: () => void, originalMessage?: string) {
  if (dismissTimeout) {
    clearTimeout(dismissTimeout);
  }
  if (onDismiss) {
    onDismiss();
  }
  setTimeout(() => {
    if (originalMessage === currentMessage) {
      getElement("nf").innerHTML = render("");
      currentMessage = "";
    }
  });
}

export const notifications = {
  weRaisedStakes: (name: string, points: number) =>
    `${name} called ${getRaiseName(points)}! Waiting response...`,
  theyAccepted: "They accepted! Let's continue...",
  theyRejected: "They rejected! The round is yours!",
  theyRaisedStakes: (name: string, points: number) =>
    `${name} called ${getRaiseName(points)}! What do you said?`,
  weWon: "This round is yours. Congrats!",
  weLost: "You lost this round. No good!",
  weWonGame: "You won the game! Brilliant!",
  weLostGame: "You lose the game! Try again!",
  weAccepted: "You accepted! Let's continue...",
  weRejected: "You rejected! The round is theirs!",
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
