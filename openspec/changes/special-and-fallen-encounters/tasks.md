## 1. Special deck

- [ ] 1.1 Add tests: `setup.test.ts` Cthulhu's special deck holds 6 shuffled cards and Azathoth's none; `encounter.test.ts` drawing special shows the top card and finishing discards it; Azathoth refuses naming the lack. Verify: fail.
- [ ] 1.2 Add `decks.special`, the setup shuffle, the version bump, and the draw, replenish and discard paths (design D1). Verify: 1.1 passes.

## 2. Defeated investigator's encounter

- [ ] 2.1 Add tests: `encounter.test.ts` Lily Chen on Leo Anderson's city resolves his encounter, the card is `fallen` with his id, finishing marks him removed and passes the seat; refused when no fallen token lies there; `effects.test.ts` taking his possessions moves them all and a second take is refused; `pieces.test.ts` no pawn for a removed investigator. Verify: fail.
- [ ] 2.2 Add `removed`, `encounterFallen`, the `fallen` finish, `takePossessions`, the pieces skip (design D2–D4). Verify: 2.1 passes, `pnpm test` passes.

## 3. Panel

- [ ] 3.1 Add Draw special, the fallen encounter button, the sheet back and Take possessions to `Encounter.tsx`, and the Status mark (design D4). Verify in the browser with Cthulhu: Draw special shows a special card; after defeating Leo by card text and moving Lily onto his city, Resolve shows his sheet back, Take possessions lists Hired Muscle for Lily, Finish removes his pawn.

## 4. Finish

- [ ] 4.1 Run simplify/deslop over `src/engine/encounter.ts`, `src/table/Encounter.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
