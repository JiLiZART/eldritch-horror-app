## 1. Panel

- [x] 1.1 Add the strings to both i18n files and the pending step in `NewGame.tsx` (design D1). Verify in the browser: Remove shows Confirm and Cancel, Cancel keeps the slot, Confirm removes it; Abandon game behaves the same; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/NewGame.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
