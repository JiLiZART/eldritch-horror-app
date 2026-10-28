## 1. Panel

- [x] 1.1 Add `panel.previewNote` to both i18n files and the line (design D1). Verify in the browser: the line appears when an expansion is toggled on and is absent otherwise; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Panel.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
