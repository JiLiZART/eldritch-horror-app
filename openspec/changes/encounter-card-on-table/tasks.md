## 1. Geometry

- [x] 1.1 In `src/table/geometry.test.ts`, write failing tests: `encounterPosition` lies right of the sheet without overlap and left of the next sheet; then implement it and widen the sheet gap (design D2). Verify: `pnpm test` passes.

## 2. Table

- [x] 2.1 Attach the encounter face in `App.tsx` and lay it in `Sheets` (design D1). Verify in the browser: after Rest and End turn, drawing a general encounter shows the card beside Leo Anderson's sheet, and finishing it removes the card; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
