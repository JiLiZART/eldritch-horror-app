## 1. Spawns by text

- [x] 1.1 Add `effects.test.ts` cases: a gate spawned by text opens the top of the stack with a monster and logs it; a monster spawned on Buenos Aires lands there or where its back sends it; a clue lands on its printed space; an empty cup is logged; two gate spawns differ in their reshuffles. Verify: fail.
- [x] 1.2 Add `spawnGateByText`, `spawnClueByText`, `spawnMonsterByText` (design D1). Verify: 1.1 passes.

## 2. Ambush

- [x] 2.1 Add `encounter.test.ts` cases: an ambush with Color Out of Space on top fights on Buenos Aires with the Will dice waiting; continuing through a surviving monster returns it to the cup and off the board; defeat by the ambusher returns it; empty cup refused. Verify: fail.
- [x] 2.2 Add `MonsterOnBoard.ambush`, `ambush`, the return in `settle` and `defeat` (design D2). Verify: 2.1 passes, `pnpm test` passes.

## 3. Panel

- [x] 3.1 Add the spawn row and Ambush to `Effects.tsx` (design D3). Verify in the browser: Spawn gate adds a gate and a monster to the table and the log; Ambush shows the Will dice, Continue ends the fight and the monster cup count returns to its value.

## 4. Finish

- [x] 4.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/encounter.ts`, `src/table/Effects.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
