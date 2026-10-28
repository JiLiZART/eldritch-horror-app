## 1. Table

- [ ] 1.1 Add `back` to monster pieces with a test in `pieces.test.ts`, and the double-click focus and turn in `Pieces` (design D1, D2). Verify in the browser: double-clicking the monster on the gate space zooms onto it, a click shows its back, another its front; `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
