import type { AudioBoxSound } from "@/types";

export class CPlayer {
  init: (song: AudioBoxSound) => void;
  generate: () => number;
  createWave: () => BlobPart;
}
