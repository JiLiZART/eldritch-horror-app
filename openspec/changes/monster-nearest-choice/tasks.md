## 1. Engine

- [ ] 1.1 In `src/engine/effects/monsters.test.ts`, write failing tests: `monsterSteps` lists both steps when two neighbours tie, the move refuses naming them, and a chosen step is taken. Then implement (design D1, D2). Verify: `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Show the step select in the Monsters effects group and pass the pick (design D3). Verify in the browser with a state where two steps tie: the select appears and the monster lands on the picked space; `pnpm test` passes.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files; drop the deviation note from `monsters.ts`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm test:fuzz`, `pnpm build`, `pnpm content:validate` pass.
