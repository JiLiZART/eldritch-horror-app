## Why

Of the six printed actions the engine plays four; Acquire Assets is the one that turns a test of a skill into cards, and skill tests are the dice mechanic every encounter and combat will reuse (`inspired/manual_eng.pdf` p.3 "Acquire Assets", p.5 "Tests"). Asset cards today carry only a name and an image, so nothing can be bought. Modelling the test once, with the first action that needs it, settles the dice shape before encounters arrive.

## What Changes

- Asset cards carry their printed value and trait line, hand-typed from the 40 core card images into a script table (as the mythos icons were) and validated.
- A skill test becomes an engine rule: roll dice equal to the skill value plus a modifier, at least 1 die, each 5 or 6 is a success, the number of successes is the result (`manual_eng.pdf` p.5; `EH_reference.pdf` "Test"). Rolls use the game seed so a replay is deterministic.
- Acquire Assets becomes an engine action: on a city space without a monster, test Influence, then gain reserve cards with a total value at most the result; when none is gained, 1 reserve card may be discarded; the reserve is refilled from the asset deck, the asset discard reshuffled when the deck is empty (`manual_eng.pdf` p.3; `EH_reference.pdf` "Acquire Assets", "Reserve").
- The panel shows the reserve with values, the dice rolled, and a choice of cards within the result.
- **Deviations**: skill bonuses printed on possessions, improvement tokens, rerolls, the Bank Loan and Debt are not applied; the players apply them by hand through the choice of cards.
- Non-goals: Component actions, Focus, Gather Resources, card text effects of gained assets, trading values, expansion assets, combat and encounter tests.

## Capabilities

### New Capabilities
- `skill-test`: rolling a test for a skill with a modifier and counting successes.

### Modified Capabilities
- `action-phase`: the Acquire Assets action with its refusals and what the players see of the roll and the reserve.
- `content-schema`: asset cards carry their printed value and traits, validated.

## Impact

- `scripts/asset-values.ts` (hand-typed), merged by `scripts/copy-core-assets.ts` into `content/sets/eh01/cards.json`; `Card.value`, `Card.traits` typed in `src/content/types.ts`; validator checks assets.
- New `src/engine/test.ts` (dice) with tests; `src/engine/actions.ts` gains `acquireAssets`; `GameState` gains `assetDiscard` and a per-phase record of the last roll; `ActionName` gains `acquire-assets`.
- `src/table/`: reserve and roll section in the turn panel, 2D.
- `content/rules/glossary.md`: Reserve, Test, Skill exist; no new terms.
