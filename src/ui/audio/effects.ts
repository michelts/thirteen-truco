import badCard from "./assets/bad-card";
import goodCard from "./assets/good-card";
import roundLose from "./assets/round-lose";
import roundWin from "./assets/round-win";
import { Audio } from "./audio";

let sfxEnabled = true;

const assets = {
  "bad-card": badCard,
  "good-card": goodCard,
  "round-win": roundWin,
  "round-lose": roundLose,
};

const effects: Partial<Record<keyof typeof assets, Audio | undefined>> = {};

export async function toggleSFX() {
  sfxEnabled = !sfxEnabled;
  return sfxEnabled;
}

export async function playSFX(key: keyof typeof effects) {
  if (!sfxEnabled) {
    return Promise.resolve();
  }
  let audio = effects[key];
  if (!audio) {
    audio = new Audio();
    effects[key] = audio;
    await audio.init(assets[key], false);
  }
  return new Promise<void>((resolve) => {
    audio.play(() => {
      resolve();
    });
  });
}
