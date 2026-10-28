## 1. Engine

- [ ] 1.1 In `src/engine/effects/investigator.test.ts`, write failing tests: with no clue token anywhere a named space is taken and logged as the lead's choice, and no name is refused as today; with a token left the name is ignored. Then implement (design D1, D2). Verify: `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Show the space select when no clue token is left and pass the pick (design D3). Verify in the browser with a state whose pool and discard are empty: the select appears and the move lands on the picked space; `pnpm test` passes.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm test:fuzz`, `pnpm build`, `pnpm content:validate` pass.
