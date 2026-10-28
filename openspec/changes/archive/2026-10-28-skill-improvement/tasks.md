## 1. Engine

- [x] 1.1 Add `effects.test.ts` cases: improved to +1 with the log line, to +2, third refused, discarded to +1, nothing to discard refused; `test.test.ts` case: Charlie Kane improved twice rolls 6 Influence dice; `encounter.test.ts` case: defeat clears Lore improvement. Verify: fail.
- [x] 1.2 Add `improvements` to the state and setup, `improveSkill` and `discardImprovement` in `effects.ts`, the dice count in `test.ts`, the clear in `defeat` (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add the skill select with Improve and Discard improvement to `Effects.tsx` and the Improvements column to `Status` (design D4). Verify in the browser: Improve Lore twice lists "Lore +2" for Leo, a third click shows the refusal, Discard improvement lists "Lore +1".

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/test.ts`, `src/table/Effects.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
