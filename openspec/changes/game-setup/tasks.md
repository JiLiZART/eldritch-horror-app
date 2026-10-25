## 1. Content: Ancient One setup and monster token data

- [x] 1.1 Add failing tests in `src/content/core-set.test.ts`: Cthulhu sets aside 1 Deep One and 1 Star Spawn; Azathoth places 1 eldritch token on the omen track; Cultist count 5, Ghoul 2, Goat Spawn 2, non-epic token total 34; Color Out of Space relocates to `tunguska`. Verify: `pnpm test` fails on these cases only.
- [x] 1.2 Extend `src/content/types.ts` with `AncientOne.setup` and `Monster.count` / `Monster.spawnMoveTo` (design D4, D5); fill the hand tables in `scripts/copy-core-assets.ts` and regenerate `content/sets/eh01/{ancient-ones,monsters}.json` with `pnpm content:copy-core`. Verify: 1.1 tests pass; `git diff --stat content/sets/eh01` touches only those two files.
- [x] 1.3 Add failing tests in `src/content/validate.test.ts`: unknown set-aside monster id fails naming the id; unknown relocation space fails naming the monster. Then extend `validateSet` (board passed in for space ids). Verify: `pnpm test` and `pnpm content:validate` pass.

## 2. Engine: seeded random

- [x] 2.1 Write `src/engine/rng.test.ts`: same seed gives the same sequence in [0, 1); `shuffle` keeps every item once and is reproducible; different seeds differ. Verify: fails to compile.
- [x] 2.2 Implement `src/engine/rng.ts` (splitmix32, Fisher–Yates, design D2). Verify: 2.1 passes.

## 3. Engine: setup

- [x] 3.1 Add `src/engine/types.ts` with `GameState`, `SetupOptions`, `MonsterInstance` (design D1, D5) and `src/engine/setup.test.ts` loading the board and core set from disk with a fixed seed; first tests: nine investigators refused naming eight, duplicate investigator refused naming it, unknown Ancient One refused, lead investigator is seat 0. Verify: tests fail.
- [x] 3.2 Implement option validation and the state skeleton in `src/engine/setup.ts` (design D7, D9). Verify: 3.1 passes.
- [x] 3.3 Tests: Akachi Onyele on `space-15` with 5 health and 7 sanity holding Mists of Releh and 1 clue, clue pool 36 minus starting clues; Charlie Kane holds Personal Assistant and it is in neither the asset deck nor the reserve. Then implement investigator placement and starting possessions. Verify: tests pass.
- [x] 3.4 Tests: Cthulhu doom 12 and omen green; Azathoth 1 eldritch token on the green omen space; Azathoth cup has 34 tokens with 5 Cultists and no epic monster; Cthulhu cup lacks Deep One and Star Spawn and set-aside records them. Then implement doom, omen, cup and set-aside. Verify: tests pass.
- [x] 3.5 Tests: Azathoth normal deck is 16 cards in stage order 1/2/1, 2/3/1, 2/4/0 by colour; hard difficulty has no easy card; a contrived Ancient One asking for 13 blue cards is refused naming blue. Then implement the mythos builder (design D6). Verify: tests pass.
- [x] 3.6 Tests: four investigators give 1 gate on a core city with 1 monster, 2 clues on different core spaces, gate stack 8, surge 2; seven investigators give 2 gates and 4 clues; a seeded case where the gate's monster is Color Out of Space puts it on `tunguska`; gate stack is exactly the 9 named core cities. Then implement reference card table, gate stack, clue pool and spawning (design D3, D5). Verify: tests pass.
- [x] 3.7 Tests: reserve holds 4 assets and asset deck size is 40 minus 4 minus starting assets; active expedition space matches the top expedition card's name prefix and is a core wilderness space; Cthulhu has 1 current mystery and 3 in the deck; other decks are shuffled (order differs from content order for the seed). Then implement reserve, expedition, mystery and deck shuffles (design D8). Verify: tests pass.
- [x] 3.8 Test: two setups with the same seed and options are deep-equal; different seeds differ. Verify: passes without code changes, or fix the leak.

## 4. Glossary

- [x] 4.1 Add to `content/rules/glossary.md`: Gate stack, Clue pool, Monster cup, Reference card, Set aside (EN/RU, rulebook citations); note on Mystery that the enter-play effect is applied by players. Verify: `src/content/rules.test.ts` still passes and entries follow the existing format.

## 5. Finish

- [x] 5.1 Run simplify/deslop over `src/engine/` and the content changes; remove dead code and unneeded comments. Verify: `pnpm typecheck`, `pnpm test`, `pnpm content:validate`, `pnpm build` all pass; `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters` clean.
