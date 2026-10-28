## 1. Geometry

- [x] 1.1 In `src/table/geometry.test.ts`, change the extent tests to expect the 0.3 margin, see them fail, then pad `tableExtent` (design D1). Verify: `pnpm test` passes; in the browser, bringing up Leo Anderson's first held card leaves a dark margin left of and below it.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
