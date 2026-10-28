## 1. Engine

- [x] 1.1 Add tests: `board.test.ts` or `geometry.test.ts` nearest picks the smallest distance, the first on a tie, the start itself when it is a candidate, undefined with none; `effects.test.ts` nearest city from space 2 is San Francisco, already on a city stays with the log line, nearest gate with one gate on London, no clue anywhere refused. Verify: fail.
- [x] 1.2 Add `nearest`, `moveInvestigatorToNearest`, and use `nearest` in `defeat` (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add the target select and Move to nearest to the Investigator group (design D4). Verify in the browser: with Leo on Buenos Aires, Move to nearest sea moves him to a sea space named in the log.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/encounter.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
