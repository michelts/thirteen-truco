import music1 from "./assets/music1";
import { Audio } from "./audio";

let musicEnabled = true;
let music: Audio;

export async function toggleMusic(value?: boolean) {
  await initMusic();
  if (value !== undefined) {
    musicEnabled = !value;
  }
  if (!musicEnabled) {
    musicEnabled = true;
    music.play();
  } else {
    musicEnabled = false;
    music.stop();
  }
  return musicEnabled;
}

async function initMusic() {
  if (!music) {
    music = new Audio();
    await music.init(music1, true);
  }
}

export async function stopMusic() {
  music.stop();
}

export async function possiblyPlayMusic() {
  await initMusic();
  if (musicEnabled) {
    music.play();
  }
}
