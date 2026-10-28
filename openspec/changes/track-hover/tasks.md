## 1. Table

- [ ] 1.1 Add the three strings to both i18n files, the labels to the tracks prop in `App.tsx`, and the hover badge to the track tokens in `Tracks` (design D1, D2). Verify in the browser: hovering the doom token shows "Doom 15" and the omen token its colour line; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
