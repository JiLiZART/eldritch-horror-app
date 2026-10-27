## 1. Delayed

- [x] 1.1 Add `effects.test.ts` cases: delayed by text with the log line, already delayed refused; `actions.test.ts` cases: a delayed active investigator's rest is refused, ending the turn stands up and passes; `encounter.test.ts` case: a delayed investigator still encounters. Verify: fail.
- [x] 1.2 Add `InvestigatorState.delayed`, `delay` in `effects.ts`, the `mayAct` refusal and the `endTurn` stand-up (design D1). Verify: 1.1 passes.

## 2. Movement and defeat relocation

- [x] 2.1 Add `effects.test.ts` cases: moved to Arkham with the log line, unknown space refused; `encounter.test.ts` case: a defeated investigator on space 2 holding Cursed lies on San Francisco with Cursed back in the condition deck. Verify: fail.
- [x] 2.2 Implement `moveInvestigator` (design D2) and the relocation and condition reshuffle in `defeat` (design D3), sharing the seeded reshuffle helper. Verify: 2.1 passes.

## 3. Panel

- [x] 3.1 Add Move and Delay to `Effects.tsx`, the stand-up turn to `Turn.tsx`, marks in `Status` and `pieces.ts` (design D4). Verify in the browser: Delay marks Leo, his next Action turn offers only End turn and clears the mark; Move to Arkham moves the pawn on the table.

## 4. Finish

- [x] 4.1 Run simplify/deslop over `src/engine/effects.ts`, `src/engine/encounter.ts`, `src/table/Effects.tsx`, `src/table/Turn.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
