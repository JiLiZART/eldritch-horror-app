## 1. Tests

- [ ] 1.1 Add the board bounds to the fuzz invariants (design D1). Verify: `pnpm test` and `pnpm test:fuzz` pass, or a failing seed is reported with its bound and a change is proposed for it.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/engine/fuzz.test.ts`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
