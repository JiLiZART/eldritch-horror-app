## 1. Adapter

- [x] 1.1 Add `saved.test.ts` cases: `parseGame` of a saved state loads it, of garbage and of an older version returns the notes, of an empty string returns nothing; `fileName` names the seed and round. Verify: fail.
- [x] 1.2 Add `parseGame` and `fileName`, route `loadGame` through `parseGame` (design D1). Verify: 1.1 passes.

## 2. Controls

- [x] 2.1 Add Save to file and the file input to `NewGame.tsx` and the handlers to `App.tsx` (design D2, D3). Verify in the browser: Save to file downloads a file named with the seed and round; loading it after Abandon resumes the round with Undo disabled; loading a text file shows the could-not-be-read note and leaves the game.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/table/saved.ts`, `src/table/NewGame.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
