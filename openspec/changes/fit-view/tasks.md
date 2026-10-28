## 1. Table

- [ ] 1.1 Add the `fit` prop, the fit target in `Scene` and the `minZoom` goal in the rig (design D1). Verify in the browser: after bringing up the mystery card, Fit table glides back until the whole table is in view with the selection unchanged; `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Add `panel.fitTable` to both i18n files and the button beside Undo in `NewGame.tsx` or `Panel.tsx`, wired through `App.tsx` (design D2). Verify: `pnpm content:validate` and `src/table/lang.test.ts` pass; the Russian label shows with the panel in Russian.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
