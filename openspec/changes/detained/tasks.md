## 1. Engine

- [ ] 1.1 Add `actions.test.ts` cases: a Detained investigator's travel refused, rest allowed; `effects.test.ts` case: card-text move refused; `encounter.test.ts` cases: fight and draw refused naming the back, finish allowed with a Ghoul on the space passing to Lily Chen. Verify: fail.
- [ ] 1.2 Add `isDetained` and the refusals in `travel`, `moveInvestigator`, `fight`, `drawEncounter`, and the `finishEncounter` skip (design D1, D2). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [ ] 2.1 Show the Detained back with the note in `Encounter.tsx` instead of the fight and draw controls; drop the footer line (design D3). Verify in the browser: gain Detained by card text for Leo in his encounter, finish, next round's Encounter phase shows the back and only Finish; Travel on his Action turn is refused.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/encounter.ts`, `src/table/Encounter.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
