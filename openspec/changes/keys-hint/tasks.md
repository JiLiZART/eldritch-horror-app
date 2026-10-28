## 1. Panel

- [x] 1.1 Add `game.keys` to both i18n files and the line in `NewGame.tsx` (design D1). Verify in the browser: the line shows in English and in Russian; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
