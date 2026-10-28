## 1. Random play

- [ ] 1.1 Write `src/engine/fuzz.test.ts` with the per-phase candidate steps and the invariant check (design D1–D4). Verify: the test runs under `pnpm test` and either passes or names seed, round and step for each failure.
- [ ] 1.2 Fix each failure the test finds in the engine with a regression test beside the existing ones; list them in the apply report. Verify: `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/engine/fuzz.test.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
