## Why

"Spawn 1 Gate", "Spawn 1 Monster on your space", "Spawn 1 Clue" and "A Monster ambushes you!" are the commonest lines on encounter and mythos cards after health and sanity, and all four still have to be done by hand: the engine spawns only for the Mythos icons, and an ambush has no way to fight a monster that is not on the board (`inspired/manual_eng.pdf` p.3 "Spawn gates", "Ambush"; `inspired/EH_reference.pdf` p.3 "Врата", p.4 "Засада", p.6 "Монстры").

## What Changes

- Spawn by card text: in the Encounter and Mythos phases the players spawn a gate (top of the stack with its monster, the discard reshuffled first, doom advancing instead when no token is left), a clue (top of the pool, the discard reshuffled first), or a monster from the cup on any space they name, the token back's move honoured as when spawned by the Mythos.
- Ambush: in the Encounter phase the encountering investigator fights the top monster of the cup at once; it is not spawned, so its token back does not move it and no spawn effect applies; after the fight, won or not, the token returns to the cup, and so it does when the investigator is defeated mid-fight (`manual_eng.pdf` p.3 "Ambush").
- The panel offers Spawn gate, Spawn clue, Spawn monster on the chosen space, and Ambush during an encounter.
- **Deviations**: the space a card names is the players' reading; "spawn a monster of a named type" and set-aside monsters are not offered; an epic monster is never in the cup, so never ambushes.
- Non-goals: reckoning, monster back text, set-aside spawns, named monsters.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: gates, clues and monsters are spawned by card text; a monster ambushes the investigator.

## Impact

- `src/engine/effects.ts`: `spawnGateByText`, `spawnClueByText`, `spawnMonsterByText`, `ambush`; `src/engine/encounter.ts`: the ambushing token returns to the cup when the fight settles and on defeat; `MonsterOnBoard.ambush`.
- `src/table/Effects.tsx`: the spawn row and Ambush. 2D panel plus the existing table pieces.
- `content/rules/glossary.md`: Ambush, Gate, Clue, Monster cup exist; no new terms.
