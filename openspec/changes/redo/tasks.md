## 1. App

- [ ] 1.1 Add `game.redo` to both i18n files, the redo stack and the button (design D1). Verify in the browser: Rest, Undo, Redo restores "1 actions left" and disables Redo; Rest, Undo, then End turn leaves Redo disabled; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
