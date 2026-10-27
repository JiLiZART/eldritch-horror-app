## 1. Doom and awakening

- [ ] 1.1 Add `ancientOne.test.ts` cases: doom advanced by card text with the log; retreat past the start refused; advance past 0 refused; awakens on the omen at doom 1 with a matching gate, on card text, and only once. Verify: fail.
- [ ] 1.2 Create `src/engine/ancientOne.ts` with `changeDoom` and `awakenAt0`, add `GameState.awakened`, call `awakenAt0` from `advanceOmen`, `spawnGate` and `defeat` (design D1, D2). Verify: 1.1 passes.

## 2. Mysteries and victory

- [ ] 2.1 Add `ancientOne.test.ts` cases: a solved mystery joins the pile and the next is drawn; the final mystery is refused while asleep; three solved wins with the reason; three solved after awakening waits for the final mystery, then wins. Verify: fail.
- [ ] 2.2 Add `solvedMysteries`, `finalMysterySolved`, `WonPhase`, `solveMystery`, `solveFinalMystery` and the win check (design D3); setup starts with an empty pile. Verify: 2.1 passes, `pnpm test` passes.

## 3. Panel

- [ ] 3.1 Add the doom and mystery row to `Effects.tsx`, the awakened mark, sheet back and solved count to `Status`, and the won section to `App.tsx`; drop the "not modelled" note (design D4). Verify in the browser: Advance doom lowers the doom line; at doom 0 the header reads "(awakened)" and the sheet back shows; three Solve mystery clicks show "The investigators win".

## 4. Finish

- [ ] 4.1 Update the Mystery entry in `content/rules/glossary.md` (the app solves mysteries by card text); run simplify/deslop over `src/engine/ancientOne.ts`, `src/table/Effects.tsx`, `src/table/Panel.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
