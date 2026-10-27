## Why

Mythos card text and monster token backs often read "move 1 Monster 1 space toward the nearest investigator", "move this Monster to X" or "discard 1 Monster", and today each one has to be done by editing nothing: the panel only touches investigators. Monsters are the last board pieces card text cannot reach (`inspired/manual_eng.pdf` p.4 "Monsters"; `inspired/EH_reference.pdf` p.2 "Nearest", p.11 monsters discarded, p.13 epic monsters).

## What Changes

- Monster movement by card text: in the Encounter and Mythos phases the players may move any monster on the board to a space they name, or 1 space toward the nearest standing investigator along a shortest route (`EH_reference.pdf` p.2: distance is the number of paths on the shortest route; a space that already qualifies is itself the nearest).
- Monster discard by card text: a discarded non-epic monster returns to the monster cup; an epic monster leaves the game (`EH_reference.pdf` p.11, p.13).
- The panel lists the monsters on the board beside the other effects with Move, Toward nearest investigator and Discard.
- **Deviations**: a tie among nearest investigators or among routes is broken by seat order and board order instead of the active investigator's choice; the cup is not reshuffled on return, as after combat; set-aside monsters cannot reach the board yet, so they return to the cup too; whether an epic monster may be moved is the players' call.
- Non-goals: automatic reckoning, mythos text parsing, monster health reset, mysteries, awakening.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: monsters are moved and discarded by card text, and the panel offers these controls.

## Impact

- `src/engine/effects.ts` gains `moveMonster`, `moveMonsterToward`, `discardMonster` on the existing phase gate; `neighbors` and `distance` from `src/content/board.ts`.
- `src/table/Effects.tsx`: a monster row (select, Move using the space select, Toward nearest, Discard). The table redraws the token from state; no new 3D element.
- `content/rules/glossary.md`: Monster, Nearest, Monster cup, Epic monster exist; no new terms.
