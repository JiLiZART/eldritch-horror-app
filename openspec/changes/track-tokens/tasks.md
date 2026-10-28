## 1. Data and geometry

- [ ] 1.1 Add `geometry.test.ts` cases: doom 20 at `from`, doom 0 at `to`, doom 10 halfway; omen 0 on top of the centre, 1 to its right; `validate.test.ts` cases: a board without tracks or with a coordinate outside 0 to 1 fails naming the track. Verify: fail.
- [ ] 1.2 Add `tracks` to `board.json`, the type, the validation, `doomPosition` and `omenPosition` (design D1, D2). Verify: 1.1 passes, `pnpm content:validate` passes.

## 2. Table

- [ ] 2.1 Add the `Tracks` component and the `tracks` prop (design D3). Verify by screenshot: at doom 15 the doom token sits on the printed 15, after Advance doom on 14; the omen token sits on the comet and after a Mythos omen advance on the next space clockwise; two eldritch tokens show beside the comet after two Add eldritch on green.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/table/geometry.ts`, `src/table/Table.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
