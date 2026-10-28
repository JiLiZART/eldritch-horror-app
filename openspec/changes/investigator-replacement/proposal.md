## Why

A defeated investigator's player sits out for the rest of the game: the rules hand them a previously unused investigator at the end of the Mythos phase, prepared as at setup, unless the Ancient One has awakened (`inspired/manual_eng.pdf` p.4 "Defeated", "The Ancient One Awakens"; `inspired/EH_reference.pdf` p.12 "Побеждённые сыщики"). The panel still says defeated investigators are not replaced.

## What Changes

- Replacement at the end of the Mythos phase: after the mythos card is resolved, each defeated investigator not yet replaced takes an unused investigator from the set, prepared as at setup: starting space, health, sanity, clues from the pool, starting cards from their decks. The newcomer takes the fallen seat in turn order; the fallen token stays on its city with its possessions set aside (`manual_eng.pdf` p.4 step 3).
- The next round waits: with a replacement due and an unused investigator left, the next round is refused until every fallen seat is filled; with none left, play goes on.
- After the awakening a defeated investigator is eliminated: no replacement is offered (`manual_eng.pdf` p.4).
- The Mythos panel lists each fallen seat with a choice of unused investigators and a Replace button; Status marks who replaced whom; the footer no longer says defeated investigators are not replaced.
- **Deviations**: the choice of investigator is the players' (no random pick); encounters with a defeated investigator's token stay with the players.
- Non-goals: Devoured, Lost in Time and Space, the defeated token's encounter.

## Capabilities

### New Capabilities
- `investigator-replacement`: who replaces a defeated investigator, when, and what the newcomer starts with.

### Modified Capabilities
- `encounter-phase`: the defeat requirement drops "no replacement investigator is chosen".

## Impact

- `src/engine/mythos.ts`: `replaceInvestigator`, the `nextRound` refusal; `src/engine/setup.ts` exports `placeInvestigator`; `InvestigatorState.replacedBy`.
- `src/table/Mythos.tsx` (replacement row), `Panel.tsx` (mark), `Encounter.tsx` (footer). 2D panel only.
- `content/rules/glossary.md`: Defeated already names the replacement; no new terms.
