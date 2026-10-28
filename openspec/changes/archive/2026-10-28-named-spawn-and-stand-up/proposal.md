## Why

Two lines of card text still have no button: "Spawn 1 Cultist on your space", which Ancient One sheets and mythos cards print by kind, and "you are no longer Delayed", which ends a delay before the next Action turn (`inspired/manual_eng.pdf` p.3 "Monsters", p.4 "Delayed"; `inspired/EH_reference.pdf` p.4, p.6). Both are a few lines on top of effects that exist.

## What Changes

- Named spawn from the cup: card text spawns a monster of a named kind on any space the players name, taken from wherever it lies in the cup, its token back honoured; refused when the cup holds none of that kind.
- Stand up by card text: a delayed investigator's token is stood up at once; refused when they are not delayed.
- The Board group offers a choice of kinds in the cup with a Spawn button on the chosen space; the Investigator group offers Stand up.
- **Deviations**: none new; the space a card names stays the players' reading.
- Non-goals: spawning by trait, epic monsters' own spawns.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: a named monster is spawned from the cup.
- `delayed-investigator`: card text ends the delay early.

## Impact

- `src/engine/effects.ts`: `spawnNamed`, `standUp`; `src/table/Effects.tsx`: the kind select, Spawn and Stand up. 2D panel plus the table pieces.
- `content/rules/glossary.md`: Monster cup and Delayed exist; no new terms.
