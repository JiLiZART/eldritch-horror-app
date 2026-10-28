## 1. Tests

- [ ] 1.1 Create `src/engine/effects/fixture.ts` from the shared top of `effects.test.ts`, move each describe to `src/engine/effects/<module>.test.ts` by design D1, delete `effects.test.ts`. Verify: `pnpm test` passes with the same total count as before (394).

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the new files (no dead imports). Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
