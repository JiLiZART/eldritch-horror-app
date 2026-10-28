## 1. Engine

- [x] 1.1 Add `actions.test.ts` cases: Hired Muscle's action spends one of Leo Anderson's actions and marks it used; a second use refused as used; Lily Chen on his space uses it; Lily Chen elsewhere refused as out of reach; the sheet's own action allowed; the next round clears the list; the journal holds the component action. Verify: fail.
- [x] 1.2 Add the `ActionName` member, `usedComponents`, the version bump, `componentAction`, the clear in `nextRound` (design D1–D3). Verify: 1.1 passes, `pnpm test` passes.

## 2. Panel

- [x] 2.1 Add the select and button to `Turn.tsx` and the journal name in `Panel.tsx` (design D4). Verify in the browser: Component action on Hired Muscle leaves Leo "1 actions left" and a second attempt shows the used refusal.

## 3. Finish

- [x] 3.1 Run simplify/deslop over `src/engine/actions.ts`, `src/table/Turn.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
