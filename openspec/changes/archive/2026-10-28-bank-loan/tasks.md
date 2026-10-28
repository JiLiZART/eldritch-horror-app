## 1. Engine

- [x] 1.1 Add `actions.test.ts` cases: the loan on a 1-success roll lets cards worth 3 through and leaves Debt in the conditions; refused with Debt held; refused a second time on one roll; a reroll after the loan still counts the 2. Verify: fail.
- [x] 1.2 Add `loan` to the waiting roll, `takeBankLoan`, and the count in `takeAssets` (design D1, D2). Verify: 1.1 passes, `pnpm test` passes.

## 2. Form

- [x] 2.1 Add the button and the result wording to `Acquire.tsx` (design D3). Verify in the browser: Acquire Assets on Buenos Aires, Take Bank Loan shows "+2 Bank Loan" in the result, lists Debt in Status and disables the button.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/actions.ts`, `src/table/Acquire.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
