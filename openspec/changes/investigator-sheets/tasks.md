## 1. Geometry

- [x] 1.1 In `src/table/geometry.test.ts`, write failing tests: `sheetPosition` puts sheet 0 below the board's bottom edge starting at its left edge and sheet 1 to its right without overlap; `tableExtent` with two sheets drops `minY` to the row's bottom, and with eight sheets `maxX` passes the tableau's edge. Then implement (design D1). Verify: `pnpm test` passes.

## 2. Table

- [x] 2.1 Add `Sheets` to `Table.tsx` and the `sheets` prop from `App.tsx` (design D2). Verify in the browser: after set-up with Leo Anderson and Lily Chen both sheets lie below the board in the fitted view, and clicking Lily Chen's sheet zooms onto it with the selection unchanged; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
