## Why

The random-play test ends every game in round 1: three Solve mystery picks win it, or doom and devouring lose it, before a second round starts. Rounds 2 to 20 hold the rules the unit tests cover least, replacements, replenished decks, awakening, used components clearing, journals folding, and none of it is exercised. No rulebook source: engineering hygiene, as for the first test.

## What Changes

- Weighted picks: game-ending effects (solving mysteries, advancing doom, devouring, repeated health and sanity loss) become rare; advancing steps (End turn, Finish, Continue, Resolve, Next round, Replace) become common, so games run through many rounds within the step budget.
- Phase invariants after every step: the active investigator and the lead are standing and not removed; no encounter card or fight waits outside the Encounter phase; the round only ever grows by 1 at the Mythos phase's end; used components are empty at a round's start; a replaced investigator's seat is filled by an investigator in the game.
- A depth assertion: each seed reaches at least round 5 or ends the game by a rule.
- Fixes for whatever the deeper play finds, each with its own regression test.
- **Deviations**: none; test-only change, `skip_specs`.
- Non-goals: performance tuning, coverage reports.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- none (test-only change, `skip_specs: true`)

## Impact

- `src/engine/fuzz.test.ts`; any engine file the findings touch, with regression tests.
