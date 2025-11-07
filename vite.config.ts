import { resolve } from "node:path";
import { defineConfig } from "vite";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = repoName ? `/${repoName}/` : "/";

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        oneChannel: resolve(__dirname, "one-channel.html"),
        threeChannel: resolve(__dirname, "three-channel.html"),
      },
    },
  },
});
