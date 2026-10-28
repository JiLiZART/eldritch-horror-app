## 1. Pieces

- [x] 1.1 Add `pieces.test.ts` cases: a delayed pawn and a defeated pawn carry `lying`, a standing one does not. Verify: fail.
- [x] 1.2 Add `lying` in `pieces.ts` and the rotation and raise in `Table.tsx` (design D1, D2). Verify: 1.1 passes, `pnpm test` passes; in the browser, Delay on Leo turns his standee sideways in a screenshot and Stand up rights it.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/pieces.ts`, `src/table/Table.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
