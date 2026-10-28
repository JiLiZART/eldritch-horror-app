## 1. Table

- [x] 1.1 Add the `focus` prop and its resolution in `Scene` (design D1). Verify: `pnpm exec tsc --noEmit` passes.

## 2. Panel

- [x] 2.1 Wrap the thumbnails in buttons and wire Show sheet and the counter through `App.tsx` (design D2). Verify in the browser: tabbing to the first reserve thumbnail and pressing Enter zooms the table onto that card; Show sheet zooms onto the sheet; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
