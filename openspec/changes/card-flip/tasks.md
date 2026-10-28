## 1. Table

- [ ] 1.1 Add `back` to the faces that have one in `App.tsx`, and the turned state in `Face` keyed on focus (design D1, D2). Verify in the browser: bringing a held condition up and clicking it again shows its back, a further click the front; the Ancient One sheet ignores the extra click; `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
