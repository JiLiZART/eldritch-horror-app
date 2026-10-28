## 1. Storage adapter

- [ ] 1.1 Add `saved.test.ts` cases with a fake storage: a saved game loads back equal; an empty slot loads undefined; garbage and an object without a phase load undefined; clear empties the slot. Verify: fail.
- [ ] 1.2 Add `src/table/saved.ts` (design D1). Verify: 1.1 passes.

## 2. App

- [ ] 2.1 Add the history, Undo, save-on-step, resume-on-load and clear-on-abandon to `App.tsx` and `NewGame.tsx` (design D2–D4). Verify in the browser: Rest then reload keeps round 1 with Rest spent and Undo disabled; Rest then Undo restores the turn; a refused action then Undo reverts the step before; Abandon then reload shows the New game form.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/table/App.tsx`, `src/table/saved.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
