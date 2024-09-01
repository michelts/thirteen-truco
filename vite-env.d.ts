/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEBUG_OPPONENT_CARDS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
