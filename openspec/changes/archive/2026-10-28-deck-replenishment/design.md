## Context

See proposal.md. `drawEncounter` in `src/engine/encounter.ts` takes the top of `decks.encounters[deck]` or `decks.research` and throws "the X deck is empty"; `finishEncounter` discards to `encounterDiscards[deck]` and, for expeditions, moves the token by the new top card through `expeditionSpace`. `gainCard` in `effects.ts` reads `decks[deck]` and `assetDiscard` / `artifactDiscard` exist. `reshuffle(state, items)` in `rng.ts` shuffles from the seed and bumps `rolls`.

## Goals / Non-Goals

**Goals:**
- One rebuild helper for every discard-backed deck; no new state.

**Non-Goals:**
- The mythos deck; the unique asset deck (see proposal).

## Decisions

### D1. `replenish(state, deck)` rebuilds when empty
In `encounter.ts`: when the named encounter or research deck is empty and its discard is not, the discard is `reshuffle`d into the deck and the discard emptied; otherwise the state is returned unchanged. `drawEncounter` calls it before the draw (a deck left empty by an older state) and after (the rule's "immediately"), so the card drawn never lands in its own rebuild. The empty-deck refusal becomes "the X deck and its discard are empty". Layer: engine.
- Rejected: rebuilding lazily in `finishEncounter` only. The expedition token would see an empty deck between draw and finish, and a rebuild then would shuffle the card just resolved back on top.

### D2. `gainCard` rebuilds the asset and artifact decks
Before reading the deck, an empty `asset` or `artifact` deck takes its discard through the same seeded shuffle. Spells and conditions are untouched: their discards return at once already. Layer: engine.
- Rejected: a shared helper across `actions.ts` (`refillReserve`), `effects.ts` and `encounter.ts`. Three call sites with three state shapes; a four-line inline rebuild each is smaller than the abstraction.

## Risks / Trade-offs

- Each rebuild bumps `rolls` → later dice differ from older games; intended, the seed still replays.
- A rebuild just before a reserve refill and one inside it use different shuffle streams (`rng` vs `reshuffle`) → both seeded; no gameplay difference.

## Open Questions

- None.
