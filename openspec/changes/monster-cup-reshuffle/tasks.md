## 1. Engine

- [ ] 1.1 Add `encounter.test.ts` case: a Byakhee defeated with a known cup leaves the cup one longer, containing it, in a seeded order that differs from the plain append for at least one seed, with `rolls` bumped; `effects.test.ts` case: a discarded Byakhee is shuffled in and `rolls` bumped; an ambusher's return bumps `rolls`. Verify: fail.
- [ ] 1.2 Add `toCup` and use it in `settle`, `returnAmbushers` and `discardMonster` (design D1). Verify: 1.1 passes, `pnpm test` passes.

## 2. Finish

- [ ] 2.1 Run simplify/deslop over `src/engine/encounter.ts`, `src/engine/effects.ts`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
