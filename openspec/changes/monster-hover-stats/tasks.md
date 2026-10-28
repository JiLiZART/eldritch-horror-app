## 1. View model

- [x] 1.1 In `src/table/pieces.test.ts`, write failing tests: a Byakhee piece's `hint` carries its printed numbers and a cultist's the Ancient One's values. Add the three strings to both i18n files and build the hint in `piecesOnSpace` (design D1). Verify: `pnpm test` and `pnpm content:validate` pass.

## 2. Table

- [x] 2.1 Show the hint as a second line in the hover badge in `Table.tsx` and `table.css` (design D2). Verify in the browser: hovering the monster on the gate space shows its name and its numbers; `pnpm test` passes.

## 3. Finish

- [x] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
