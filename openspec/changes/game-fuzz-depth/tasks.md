## 1. Deeper play

- [ ] 1.1 Add the weights, the phase invariants and the depth assertion to `src/engine/fuzz.test.ts` (design D1–D3). Verify: the test runs under `pnpm test`, reaching round 5 or a rule's end for every seed, or names seed, round and step for each failure.
- [ ] 1.2 Fix each failure found in the engine with a regression test; list them in the apply report. Verify: `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/engine/fuzz.test.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
