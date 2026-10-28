## 1. Data and geometry

- [ ] 1.1 Add `geometry.test.ts` cases for `reservePosition` (first at `from`, last at `to`) and `validate.test.ts` cases for reserve data outside the board. Verify: fail.
- [ ] 1.2 Add `tracks.reserve` to `board.json`, the type, the validation and `reservePosition` (design D1, D2). Verify: 1.1 passes, `pnpm content:validate` passes.

## 2. Table

- [ ] 2.1 Draw the reserve cards in the slots from a `reserve` list of image paths in the `tracks` prop (design D3). Verify by screenshot: the four reserve faces lie in the four printed frames at setup, and after Acquire Assets takes a card the slots show the refilled reserve.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/table/Table.tsx`, `src/table/geometry.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
