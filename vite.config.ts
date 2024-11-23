import { defineConfig } from "vite";
import suidPlugin from "@suid/vite-plugin";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  base: "/krm-ui",
  plugins: [suidPlugin(), solidPlugin()],
  build: {
    target: "esnext",
    sourcemap: true,
    outDir: "dist/krm-ui",
  },
});
