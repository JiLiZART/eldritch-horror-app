## Why

The clue pool holds 36 tokens and the rules recycle them: a discarded clue token goes to a faceup discard pile, and when the pool runs out the discard becomes the pool again (`inspired/manual_eng.pdf` p.4 "Clues"; `inspired/EH_reference.pdf` p.13 "Улики"). Today a clue spent on a reroll or by card text, or lost with a devoured investigator, leaves the game, so a long game drains the pool and random spaces and spawned clues run dry.

## What Changes

- Held clue tokens are kept by id at the game level: the token gained from a space or the pool joins the held list, and starting clues come from the pool as the ids they are.
- A spent clue, on a reroll or by card text, moves one held token to the clue discard; a devoured investigator's tokens all move there. The pool is rebuilt from the discard as the clue rules already do.
- Each investigator's count stays as it is; the held list only says which tokens are out of the pool, since a token's front is read only when it is drawn from the pool.
- **Deviations**: which of the held tokens is spent is not tracked per investigator; any held token will do, as their fronts are not read while held.
- Non-goals: tokens kept per investigator, trade bookkeeping of ids, clue tokens on the mystery.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: a spent clue joins the discard.
- `reroll`: the reroll's clue joins the discard.
- `devoured-investigator`: the devoured investigator's clues join the discard.

## Impact

- `src/engine/types.ts`: `GameState.heldClues`; `src/engine/setup.ts` collects the starting tokens; `src/engine/effects.ts` (`gainClue`, `spendClue`, `devour`), `src/engine/test.ts` (`rerollDie`), `src/engine/mythos.ts` (replacement passes the held list). No panel change.
- `content/rules/glossary.md`: Clue and Clue pool exist; no new terms.
