import { CPlayer } from "./player";

type OnEndedCallback = (() => void) | (() => Promise<void>);

export class Audio {
  audio?: HTMLAudioElement;

  async init(song: Parameters<typeof createAudio>[0], loop: boolean) {
    this.audio = await createAudio(song, loop);
    return this;
  }

  play(onEnded?: OnEndedCallback) {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.onended = onEnded ?? null;
      this.audio.play();
    }
  }

  stop() {
    this.audio?.pause();
  }
}

function createAudio(
  song: Parameters<InstanceType<typeof CPlayer>["init"]>[0],
  loop: boolean,
): Promise<HTMLAudioElement> {
  const player = new CPlayer();
  player.init(song);
  return new Promise((resolve) => {
    let audio: HTMLAudioElement;
    let done = false;
    setInterval(() => {
      if (done) {
        resolve(audio);
        return;
      }
      done = player.generate() >= 1;
      if (done) {
        // Put the generated song in an Audio element.
        const wave = player.createWave();
        audio = document.createElement("audio");
        audio.src = URL.createObjectURL(
          new Blob([wave], { type: "audio/wav" }),
        );
        audio.loop = loop;
      }
    }, 0);
  });
}
