## 1. Table

- [x] 1.1 Add `onFit` and the double-click on empty table (design D1). Verify in the browser: after zooming in, a double-click on felt refits; a double-click on a pawn leaves the zoom; `pnpm test` passes.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
