import {
  advzipPlugin,
  ectPlugin,
  defaultViteBuildOptions,
  roadrollerPlugin,
} from "js13k-vite-plugins";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: defaultViteBuildOptions,
  plugins: [roadrollerPlugin(), ectPlugin(), advzipPlugin()],
  server: {
    host: true,
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
