## Why

A long game empties the small decks: the expedition deck has 6 cards, each location deck 8, the artifact deck a dozen. Today a draw from an empty deck is refused and the expedition token has nowhere to go, though the rules rebuild every deck but the mythos deck from its discard the moment it runs out (`inspired/manual_eng.pdf` p.4 "Cards"; `inspired/EH_reference.pdf` p.7, p.11 "Колоды").

## What Changes

- Encounter and research decks: when a draw is due and the deck is empty, or the draw leaves it empty, the discard is shuffled into a new deck at once; a deck whose discard is empty too refuses the draw naming the deck. The expedition token therefore always finds a top card after an expedition encounter.
- Asset and artifact decks: gaining a card from an empty deck rebuilds it from its discard first; the reserve refill already does this.
- Rebuilt decks are shuffled from the game seed, so a replay repeats them.
- **Deviations**: the mythos deck is never rebuilt, as printed; spell and condition decks already take their discards back at once.
- Non-goals: deck size display changes, the unique asset deck, Detained.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `encounter-phase`: an empty encounter or research deck is rebuilt from its discard.
- `card-effects`: an empty asset or artifact deck is rebuilt from its discard before a card is gained.

## Impact

- `src/engine/encounter.ts`: `drawEncounter` rebuilds before and after the draw through a shared `replenish`; `src/engine/effects.ts`: `gainCard` rebuilds asset and artifact decks. `reshuffle` from `src/engine/rng.ts` supplies the seeded shuffle.
- No panel change: deck sizes already show.
- `content/rules/glossary.md`: no new terms.
