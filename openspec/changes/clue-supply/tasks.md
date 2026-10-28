## 1. Engine

- [ ] 1.1 In `src/engine/mythos.test.ts`, write a failing test: with an emptied clue pool, the newcomer holds 0 clues and the held-clue count matches. Then fix `placeInvestigator` in `setup.ts` (design D1). Verify: `pnpm test` and `pnpm test:fuzz` pass.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
