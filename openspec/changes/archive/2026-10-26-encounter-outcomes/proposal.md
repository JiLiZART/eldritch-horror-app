## Why

The Encounter phase now draws a card and the Mythos phase resolves its icons, but every line of card text is "left to the players" with nowhere to apply it: health, sanity, clues, gates and cards can only change through the engine's own rules. A round of Eldritch Horror is mostly card text (`inspired/manual_eng.pdf` p.3–4 "Encounter Phase", "Gaining Cards", "Health and Sanity", p.4 "Clues", "Gates"), so until the players can apply it by hand the game cannot be played through. This is the smallest change that makes a full round playable.

## What Changes

- Card text applied by hand: while an encounter card or a fought monster's text is pending in the Encounter phase, or after the mythos card is resolved, any standing investigator may gain or lose health and sanity (never above the sheet maximum; reaching 0 defeats them through the existing defeat rule, `manual_eng.pdf` p.4), gain 1 clue (the token on their space first, else the top of the clue pool, none when the pool and discard are empty), spend 1 clue, close the gate on their space (token to the gate discard, `manual_eng.pdf` p.4 "Gates"), gain a card (the top of the asset or artifact deck, the bottom of the spell or condition deck for a random double-sided card, or a card searched by name; spells and conditions never duplicated, `manual_eng.pdf` p.4 "Gaining Cards", "Double-sided cards") and discard a held card (assets to the asset discard, spells and conditions shuffled back into their deck, artifacts to a new artifact discard).
- Conditions are held apart from possessions and cannot be traded (`manual_eng.pdf` p.3 "Trade").
- Every applied effect is written to the phase log in rule words.
- The panel offers these effects as buttons beside the Encounter and Mythos sections, for a chosen investigator, with refusals in the rule's words.
- **Deviations**: effects that prevent a loss, spent clues returning to the clue discard (the pool only tracks tokens on the board), unique assets, "flip this card" text, and a condition's or spell's back text are left to the players.
- Non-goals: moving a pawn by card text, Delayed and Detained, skill improvement tokens, the reckoning text of held cards, monster movement, mysteries, awakening.

## Capabilities

### New Capabilities
- `card-effects`: the effects card text can have on an investigator, the board and the decks, applied by the players.

### Modified Capabilities
- `action-phase`: Trade refuses conditions (they are not possessions).

## Impact

- `src/engine/types.ts`: `InvestigatorState.conditions`, `GameState.artifactDiscard`; new `src/engine/effects.ts` with tests; `defeat` reused from `src/engine/encounter.ts`; `note` from `src/engine/spawn.ts` learns the Encounter phase log.
- `src/engine/setup.ts`: investigators start with `conditions: []`; the starting-card placement puts conditions there.
- `src/table/`: new `Effects.tsx` rendered under `Encounter` and `Mythos`, 2D; `Status` lists conditions.
- `content/rules/glossary.md`: Possession, Condition, Spell, Clue, Gate exist; no new terms.
