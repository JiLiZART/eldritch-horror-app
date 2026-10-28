## 1. Engine

- [x] 1.1 In `src/engine/effects/board.test.ts`, write failing tests: with no clue token anywhere a named space is taken for the random spawn and no name is refused; with a token left the name is ignored. Then implement (design D1). Verify: `pnpm test` passes.

## 2. Panel

- [x] 2.1 Show the space select in the Board group when no clue token is left and pass the pick (design D2). Verify in the browser with an empty pool and discard: the select appears and the monster spawns on the picked space; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm test:fuzz`, `pnpm build`, `pnpm content:validate` pass.
