## 1. Content: gate colours and mythos icons

- [x] 1.1 Add a `board.test.ts` case: Arkham's gate is red and exactly 9 core spaces carry a `gate` colour; add a `core-set.test.ts` case: "A Proposition" is an event with effects advance-omen, reckoning, spawn-clues. Verify: fail.
- [x] 1.2 Add `gate` to the 9 named cities in `content/board/board.json` from the token images; add `OmenColor`, `Space.gate`, `MythosCard.trait`, `MythosCard.effects` to `src/content/types.ts` (design D2, D1). Verify: board test passes.
- [x] 1.3 Write `scripts/mythos-effects.ts` by reading all 51 core card images; merge it in `copy-core-assets.ts`; regenerate `mythos.json` (design D1). Verify: core-set test passes; `pnpm content:validate` passes.
- [x] 1.4 Add validator checks: unknown trait or effect id fails naming the card; a mythos card without effects fails. Add `validate.test.ts` cases first. Verify: pass.

## 2. State shape and spawn helpers

- [x] 2.1 Add `spawn.test.ts`: gate from the top of the stack with 1 monster, discard reshuffled into an empty stack, doom advanced when no token is left, monster honours `spawnMoveTo`, clue from the pool with reshuffle. Verify: fails to compile.
- [x] 2.2 Implement `src/engine/spawn.ts`, add `ongoingMythos`, `mythosDiscard` and the phase union to `types.ts`, move the omen track to `src/engine/omen.ts`, refactor `setupGame` onto the helpers (design D2, D3, D5). Verify: 2.1 and `setup.test.ts` pass unchanged.

## 3. Draw and lose

- [x] 3.1 Add `mythos.test.ts` cases: the last seat's end of turn draws the top card into the Mythos phase; an empty deck sets `lost` naming the mythos deck; update the `actions.test.ts` round-rollover case. Verify: fail.
- [x] 3.2 Change `endTurn` (design D3). Verify: 3.1 passes.

## 4. Resolve icons

- [x] 4.1 Add `mythos.test.ts` cases per spec scenario: omen advance without and with a matching gate, gate spawn with monster, doom instead of a gate, surge at matching gates and without, clue spawn, players' steps logged, event discarded, ongoing kept, second resolve refused. Verify: fail.
- [x] 4.2 Implement `resolveMythos` (design D4, D5). Verify: 4.1 passes.

## 5. Next round and lead

- [x] 5.1 Add cases: `nextRound` refused before resolving, passes the lead to Lily Chen, keeps Leo Anderson by default, round 2 Action phase with the lead active. Verify: fail.
- [x] 5.2 Implement `nextRound` (design D4). Verify: 5.1 passes.

## 6. Panel

- [x] 6.1 Add `src/table/Mythos.tsx` and wire it in `App` and `Turn` (design D6): card image, Resolve, log, lead select, Next round, lost view, ongoing cards and mythos deck size in `Status`, doom 0 note, Encounter skip note. Verify in the browser: Leo then Lily, end both turns, card shown, Resolve lists the steps, pass lead to Lily, Next round shows round 2 with Lily active; new pieces appear on the table when a gate spawns.

## 7. Finish

- [x] 7.1 Spot-check 10 random entries of `scripts/mythos-effects.ts` against the card images; run simplify/deslop over `src/engine/` and `src/table/`. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass; a final Playwright pass covers the `mythos-phase` scenarios.
