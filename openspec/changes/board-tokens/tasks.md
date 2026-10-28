## 1. Engine

- [ ] 1.1 Add `effects.test.ts` cases: rumor placed on London with the log; two eldritch on Tunguska count 2; rumor removed; removing from an empty space refused naming it; unknown space refused; eldritch added to green makes 2 for Azathoth; removing from empty blue refused naming blue. Verify: fail.
- [ ] 1.2 Add `rumors` and `eldritch` to the state and setup, `placeToken`, `removeToken`, `changeEldritchOnOmen` (design D1, D2). Verify: 1.1 passes, `pnpm test` passes.

## 2. Table and panel

- [ ] 2.1 Add the `rumor` and `eldritch` piece kinds in `pieces.ts` and `Table.tsx`, and the token row in `Effects.tsx` (design D3, D4); add a `pieces` test for a space with a rumor and two eldritch tokens. Verify in the browser: Place rumor on London lists "Rumor" for London in the panel and shows the token on the table; Place eldritch twice lists two; Remove rumor clears it; Add eldritch on green shows 2 in the Omen row.

## 3. Finish

- [ ] 3.1 Run simplify/deslop over `src/engine/effects.ts`, `src/table/pieces.ts`, `src/table/Effects.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
