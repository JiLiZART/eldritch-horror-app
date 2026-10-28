## 1. App

- [ ] 1.1 Add the two strings to both i18n files, the hidden state, the buttons and the layout class (design D1). Verify in the browser: Hide panel widens the canvas to the window, Show panel restores it, the choice survives a reload; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
