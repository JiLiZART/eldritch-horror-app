## 1. State and log

- [x] 1.1 Add `effects.test.ts` cases: `note` logs in the Encounter phase; `setup.test.ts` case: an investigator with a starting condition holds it in `conditions`, not `possessions`; `actions.test.ts` case: trading a condition is refused. Verify: fail.
- [x] 1.2 Add `InvestigatorState.conditions`, `GameState.artifactDiscard`; sort starting cards in `setupGame`; extend `note`; refuse conditions in `trade` (design D2, D3). Verify: 1.1 passes.

## 2. Health, sanity, clues, gate

- [x] 2.1 Add `effects.test.ts` cases per `card-effects` scenario: Action phase refused, defeated investigator, gain at the maximum, loss defeats, token on the space, from the pool, no clue anywhere, spend without clues, gate closed, no gate. Verify: fail.
- [x] 2.2 Implement `changeHealth`, `changeSanity`, `gainClue`, `spendClue`, `closeGate` in `src/engine/effects.ts` (design D1, D5). Verify: 2.1 passes.

## 3. Cards

- [x] 3.1 Add cases: random spell from the bottom, named condition, duplicate refused, empty deck refused, spell discarded back into the deck, asset discarded, artifact discarded. Verify: fail.
- [x] 3.2 Implement `gainCard` and `discardCard` (design D4). Verify: 3.1 passes.

## 4. Panel

- [x] 4.1 Add `src/table/Effects.tsx` under `Encounter` and `Mythos` (design D6); list conditions in `Status`. Verify in the browser: with a card showing, +1 health stops at the maximum, Gain clue takes the token on the space, Gain card by name adds Cursed to the conditions, Discard removes it, a refusal reads in rule words.

## 5. Finish

- [x] 5.1 Run simplify/deslop over `src/engine/effects.ts` and `src/table/Effects.tsx`; remove dead code. Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass.
