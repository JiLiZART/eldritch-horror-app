## 1. Adapter

- [ ] 1.1 Add `saved.test.ts` cases on a fake storage: two games save to two slots listed with names; the current slot resumes; removing one leaves the other; the old single key migrates into a slot. Verify: fail.
- [ ] 1.2 Add the slot index, per-slot keys and migration to `saved.ts` (design D1). Verify: 1.1 passes.

## 2. App

- [ ] 2.1 Add the current slot, the Games list with Switch and Remove, new-slot creation on start and file load (design D2, D3). Verify in the browser: start Azathoth, take a step, start a new game with Cthulhu, switch back to the Azathoth slot and see its round and step, remove the Cthulhu slot and see one slot left; reload resumes the current slot.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/table/saved.ts`, `src/table/App.tsx`, `src/table/NewGame.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
