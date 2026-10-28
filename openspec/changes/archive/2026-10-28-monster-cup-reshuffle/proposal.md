## Why

A token that leaves the board goes back to the bottom of the cup today, in combat, by card text and after an ambush, so the next spawns are the rest of the cup in setup order and a defeated monster never comes back until the whole cup has turned over. The rules shuffle it in at once (`inspired/manual_eng.pdf` p.4 "Monsters"; `inspired/EH_reference.pdf` p.11 "Монстры"). The cup already has a seeded reshuffle for every other deck.

## What Changes

- Every return to the cup shuffles the cup: the monster defeated at its toughness, the monster discarded by card text, the ambusher after its fight or the investigator's fall. The order follows the game seed and counts as a roll, so a replay repeats it.
- **Deviations**: set-aside monsters still return to the cup, as none can reach the board yet.
- Non-goals: set-aside bookkeeping, the gate and clue reshuffles, already seeded.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `combat-encounter`: a defeated monster is shuffled back into the cup.
- `card-effects`: a discarded monster and an ambusher are shuffled back into the cup.

## Impact

- `src/engine/encounter.ts`: `settle` and `returnAmbushers` use `reshuffle`; `src/engine/effects.ts`: `discardMonster` too. No panel change.
- `content/rules/glossary.md`: Monster cup says returned at random already; no new terms.
