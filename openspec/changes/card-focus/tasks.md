## 1. Table

- [x] 1.1 Add the click on `Face`, the focus state in `Scene` and the zoom goal in `CameraRig` (design D1, D2). Verify in the browser: clicking the mystery card beside the board glides and zooms until the card fills most of the view's height, the selected space is unchanged, and a later drag holds; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over `src/table/Table.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
