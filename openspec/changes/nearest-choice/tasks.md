## 1. Graph and engine

- [x] 1.1 In `src/content/board.test.ts` (or the graph's test file), write a failing test for `nearestAll` returning every tied space; in `src/engine/effects/investigator.test.ts` a failing test that a tie is refused naming the spaces and a chosen tied space is taken. Then implement (design D1, D2). Verify: `pnpm test` passes.

## 2. Panel

- [x] 2.1 Show the tie select in the Investigator effects group and pass the pick (design D3). Verify in the browser with a state where two cities tie: the select appears and the move lands on the picked city; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files; remove the deviation note from `investigator.ts` if one is there. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm test:fuzz`, `pnpm build`, `pnpm content:validate` pass.
