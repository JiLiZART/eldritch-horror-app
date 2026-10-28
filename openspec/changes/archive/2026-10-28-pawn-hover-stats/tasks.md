## 1. View model

- [x] 1.1 In `src/table/pieces.test.ts`, write a failing test that Lily Chen's pawn hints her health, sanity and clues; add the string to both i18n files and build the hint in `piecesOnSpace` (design D1). Verify: `pnpm test` and `pnpm content:validate` pass; in the browser, hovering a pawn shows the second line.

## 2. Finish

- [x] 2.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
