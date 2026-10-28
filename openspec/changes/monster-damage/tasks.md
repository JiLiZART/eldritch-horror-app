## 1. View model

- [ ] 1.1 In `src/table/pieces.test.ts`, write a failing test: a monster with 2 health lost yields `damage: 2` and an unhurt one no `damage`. Then set it in `piecesOnSpace` (design D1). Verify: `pnpm test` passes.

## 2. Table

- [ ] 2.1 Draw the health token on wounded monsters in `Pieces` (design D2). Verify in the browser: with a saved state patched so a monster has lost 2 health, its token shows a 2 health token at its lower-right; `pnpm test` passes.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
