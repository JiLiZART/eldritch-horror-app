import react from "@vitejs/plugin-react";
import { cpSync, existsSync, readFileSync, realpathSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { defineConfig, type Plugin } from "vite";

/** Serves the committed JSON under content/ at /content/ in dev and copies it into the build. */
function contentDir(): Plugin {
  const dir = realpathSync(join(import.meta.dirname, "content"));
  let outDir = "dist";
  return {
    name: "content-dir",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent(req.url?.split("?")[0] ?? "");
        if (!url.startsWith("/content/") || !url.endsWith(".json")) return next();
        const file = resolve(dir, url.slice("/content/".length));
        // Keep requests inside content/ (no "..", no symlink escapes).
        if (!file.startsWith(dir + sep) || !existsSync(file) || !realpathSync(file).startsWith(dir + sep)) return next();
        res.setHeader("Content-Type", "application/json");
        res.end(readFileSync(file));
      });
    },
    closeBundle() {
      cpSync(dir, join(outDir, "content"), { recursive: true, filter: (p) => !p.endsWith(".md") });
    },
  };
}

export default defineConfig({
  plugins: [react(), contentDir()],
});
