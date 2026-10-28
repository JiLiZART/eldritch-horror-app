## 1. Panel

- [x] 1.1 Add the two strings to both i18n files and the Copy journal button in `Journal` (design D1). Verify in the browser with clipboard permission: after two steps the clipboard holds the round heading and both lines; `pnpm test` and `pnpm content:validate` pass.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Panel.tsx`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
