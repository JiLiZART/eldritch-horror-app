## 1. View model

- [ ] 1.1 In `src/table/pieces.test.ts`, write failing tests: the gate on a blue city hints "blue gate" with the omen on green, and "blue gate, matches the omen" with the omen on blue. Add the two strings to both i18n files and build the hint in `piecesOnSpace` with the board passed from `App.tsx` (design D1). Verify: `pnpm test` and `pnpm content:validate` pass.

## 2. Browser

- [ ] 2.1 Verify in the browser: hovering the gate on the gate space shows its colour line. `pnpm test` passes.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over the touched files. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
