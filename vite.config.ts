import { defineConfig } from "vite";
import suidPlugin from "@suid/vite-plugin";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  base: "/krm-ui",
  plugins: [suidPlugin(), solidPlugin()],
  server: {
    allowedHosts: ["localhost", "learning-immortal-griffon.ngrok-free.app"]
  },
  define: {
    __KRMUI_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    target: "esnext",
    sourcemap: true,
    outDir: "dist/krm-ui",
  },
  test: {
    exclude: [
      "**/.git/**",
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/playwright/**",
    ],
  },
});
