## 1. Geometry

- [x] 1.1 In `src/table/geometry.test.ts`, write failing tests for `tableauPosition`: the sheet centre lies right of the board's edge, rows stack downward without overlap. Then implement it in `geometry.ts` (design D1). Verify: `pnpm test` passes.

## 2. Table

- [x] 2.1 Add `Tableau` to `Table.tsx` and the `tableau` prop from `App.tsx` (design D2). Verify in the browser: after set-up against Azathoth, panning right shows the sheet and the mystery card; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
