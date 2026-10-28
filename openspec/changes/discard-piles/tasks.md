## 1. Panel

- [ ] 1.1 Add `status.discards` to both i18n files and the fold in `Status` (design D1). Verify in the browser: after discarding Hired Muscle through the Cards effects group, the fold names it under the asset discard; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/table/Panel.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
