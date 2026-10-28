## 1. Persistence

- [x] 1.1 In `src/table/saved.test.ts`, write failing tests for `exportAll` and `importAll` round-tripping two slots with a title and history, and for a refused non-backup; then implement (design D1). Verify: `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add the strings and the two controls with the handlers (design D2). Verify in the browser: Save backup downloads a file holding both slots; `pnpm test` and `pnpm content:validate` pass.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
