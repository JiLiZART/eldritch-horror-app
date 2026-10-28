## Context

See proposal.md. `moveMonsterToward` picks the nearest standing investigator by reduce and the first neighbour one path closer; the Monsters group has a Toward nearest control for the chosen monster.

## Goals / Non-Goals

**Goals:**
- The engine names every legal step; the panel asks only when needed.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `monsterSteps`
`monsterSteps(state, content, monster)` returns the neighbours of the monster's space that are one path closer to any investigator at the smallest distance, in board order; empty when the monster already shares a space with an investigator or none stands. Layer: engine, tested.

### D2. Optional choice
`moveMonsterToward(state, content, monster, chosen?)`: one step takes it; several with `chosen` among them takes it; several without a valid `chosen` throws naming them. The already-together case keeps its note. Layer: engine.

### D3. The panel asks
The Monsters group computes `monsterSteps` for the chosen monster and shows a select of the step spaces when there are several, passing the pick. Layer: panel.

## Risks / Trade-offs

- Fuzz calls without a choice → refusals counted as today.

## Open Questions

- None.
