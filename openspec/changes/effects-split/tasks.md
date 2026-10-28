## 1. Engine

- [x] 1.1 Split `src/engine/effects.ts` into `src/engine/effects/{shared,investigator,cards,board,monsters}.ts` with `effects.ts` re-exporting (design D1). Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters` and `pnpm test` pass unchanged.

## 2. Panel

- [x] 2.1 Split `src/table/Effects.tsx` into the shell and `src/table/effects/{Investigator,Cards,Board,Monsters,AncientOne}.tsx` (design D2). Verify: the type check passes and, in the browser, the five groups list the same controls as before.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the new files; remove dead code and stale comments. Verify: `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
