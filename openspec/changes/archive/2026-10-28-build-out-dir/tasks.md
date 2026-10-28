## 1. Tooling

- [x] 1.1 Add the retrying remove in `buildStart` and `build.emptyOutDir: false` to `vite.config.ts` (design D1, D2). Verify: five consecutive `pnpm build` runs exit 0 and `dist/` holds the app, `content/` and `cards/` after the last.
