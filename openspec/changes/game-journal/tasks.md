## 1. Engine

- [ ] 1.1 Add tests: `actions.test.ts` rest writes the action entry, a refused rest writes nothing; `encounter.test.ts` finishing Leo Anderson's encounter keeps his draw line with his id; `mythos.test.ts` the next round keeps the resolution lines after the encounter lines; `setup.test.ts` the journal is empty. Verify: fail.
- [ ] 1.2 Add `JournalEntry`, `journal`, `keepLog` and the calls in `advance`, `drawMythos`, `nextRound`, and the `perform` entry (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Add the Journal section to `Panel.tsx` (design D4). Verify in the browser: after a rest and an encounter the summary counts the lines and unfolding lists round 1 with the action and the encounter lines.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/engine/journal.ts`, `src/table/Panel.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
