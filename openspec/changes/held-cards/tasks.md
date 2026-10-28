## 1. Geometry

- [x] 1.1 In `src/table/geometry.test.ts`, write failing tests: `heldPosition` puts card 0 under the sheet from its left edge, card 2 in the same row, card 3 in a lower row; `tableExtent` with two held rows drops `minY` below the second row. Then implement (design D1). Verify: `pnpm test` passes.

## 2. Table

- [x] 2.1 Change the `sheets` prop shape, draw the grid in `Sheets`, build it in `App.tsx` (design D2). Verify in the browser: after set-up with Leo Anderson, Hired Muscle lies under his sheet in the fitted view and clicking it zooms onto it; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
