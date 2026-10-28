## 1. Geometry

- [ ] 1.1 In `src/table/geometry.test.ts`, write failing tests for `tableExtent`: without the tableau it equals the board's rectangle; with it, `maxX` reaches the tableau column's right edge. Then implement it (design D1). Verify: `pnpm test` passes.

## 2. Table

- [ ] 2.1 Fit `minZoom` to the extent and clamp the view in `CameraRig` (design D2). Verify in the browser: after set-up the whole board and the Ancient One sheet are in view; a long drag stops at the table's edge; `pnpm test` passes.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
