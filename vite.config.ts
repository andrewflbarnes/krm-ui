import { defineConfig } from "vite";
import suidPlugin from "@suid/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import { ServerResponse } from "node:http";

export default defineConfig({
  base: "/krm-ui",
  plugins: [suidPlugin(), solidPlugin()],
  server: {
    allowedHosts: ["localhost", "learning-immortal-griffon.ngrok-free.app"],
    proxy: {
      '^/krm-ui-storybook(/.*)?': {
        target: "http://localhost:6006",
        rewrite: (path) => path.replace(/^\/krm-ui-storybook/, ""),
        selfHandleResponse: true,
        configure: (proxy) => {
          const handleError = (res: ServerResponse, reason?: string | number) => {
            const message  = reason != "" && reason ? `: ${reason}` : "";
            console.error(`Error in proxy response${message}`);
            res.statusCode = 503;
            res.statusMessage = "Service Unavailable";
            res.end(`
              <html>
                <head>
                  <title>Storybook Unavailable</title>
                </head>
                <body>
                  <main>
                    <p>
                      Unable to reach storybook server${message}
                    <p>
                    <p>
                      To start the storybook server, run
                      <pre>pnpm storybook</pre>
                    <p>
                  </main>
                </body>
              </html>
            `)
          }
          proxy.on("error", (err, _req, res) => {
            handleError(res, err.message);
          })
          proxy.on("proxyRes", (proxyRes, req, res) => {
            if (proxyRes.statusCode > 399) {
              handleError(res, proxyRes.statusMessage || proxyRes.statusCode);
            } else {
              console.log("Proxying request to storybook:", req.url);
              res.setHeader("Location", "http://localhost:6006" + req.url);
              res.statusCode = 302;
              res.statusMessage = "Found";
              res.end();
            }
          })
        },
      },
    },
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
