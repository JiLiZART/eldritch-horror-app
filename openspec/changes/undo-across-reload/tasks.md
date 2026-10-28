## 1. Persistence

- [ ] 1.1 In `src/table/saved.test.ts`, write failing tests: a saved history comes back with the game, bounded to the last ten; removing a slot removes it; a garbage history loads as empty. Then make `saveGame`, `loadGame` and `removeGame` in `saved.ts` pass (design D1). Verify: `pnpm test` passes.

## 2. App

- [ ] 2.1 Seed and save the history in `App.tsx` on load, switch and each accepted step (design D2). Verify in the browser: after two steps and a reload, Undo is enabled, reverts both, then is disabled.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
