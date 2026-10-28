## 1. Tests

- [ ] 1.1 Add the input-state snapshot and comparison to the fuzz driver (design D1). Verify: `pnpm test` and `pnpm test:fuzz` pass, or a failing seed is reported with its step and a change is proposed for it.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/engine/fuzz.test.ts`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
