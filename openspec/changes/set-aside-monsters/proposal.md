## Why

Cthulhu sets aside a Deep One and a Star Spawn, Shub-Niggurath two Ghouls, two Goat Spawn and a Dark Young, and their sheet and mystery text spawn them by name. Setup takes them out of the cup, but nothing can put them on the board, and a discarded one would go to the cup, which the rules forbid: set-aside monsters are set aside again, and one cannot be spawned when all of its kind are on the board (`inspired/manual_eng.pdf` p.4 "Monsters"; `inspired/EH_reference.pdf` p.11 "Монстры").

## What Changes

- Spawn a set-aside monster: card text spawns one of a named kind on a space the players name, its token back honoured; refused when none of that kind is set aside.
- Set aside again: a set-aside monster defeated in combat, discarded by card text, or back from being on the board any other way returns to the set-aside pile, never to the cup.
- The Board group offers a choice of set-aside kinds with their counts and a Spawn button on the chosen space; Status lists the set-aside count with the deck sizes.
- **Deviations**: named monsters from the cup are still not offered; a set-aside monster never ambushes, since ambushes draw from the cup.
- Non-goals: Ancient One text, epic monsters' own spawns.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: set-aside monsters are spawned by name and set aside again on discard.
- `combat-encounter`: a defeated set-aside monster is set aside again.

## Impact

- `src/engine/types.ts`: `MonsterOnBoard.setAside`; `src/engine/effects.ts`: `spawnSetAside`; `src/engine/encounter.ts`: `toCup` routes set-aside tokens to `setAsideMonsters`; `src/table/Effects.tsx` (select and button), `Panel.tsx` (count). 2D panel plus the table pieces.
- `content/rules/glossary.md`: Set aside exists; no new terms.
