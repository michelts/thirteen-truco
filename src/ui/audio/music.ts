import music1 from "./assets/music1";
import { Audio } from "./audio";

let musicEnabled = false;
let music: Audio;

export async function toggleMusic() {
  if (!music) {
    music = new Audio();
    await music.init(music1, true);
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
