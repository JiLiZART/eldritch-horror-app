## Context

See proposal.md. The invariants run after every accepted step; the content gives each monster's combat block and the board its space ids; the cultist's toughness comes from the Ancient One sheet.

## Goals / Non-Goals

**Goals:**
- A handful of assertions beside the investigator bounds.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Bounds from content
For each monster on the board: `health >= 0` and, with a numeric toughness from its combat block or the sheet's cultist block, `health < toughness`; for each cup and set-aside token: `health === 0`. Gates and clues: `new Set(list).size === list.length` and every space known. `rumors`: known spaces. `eldritch`: known spaces with counts `>= 0`. `eldritchOnOmen`: every entry `>= 0`. `mysteryTokens >= 0`. Layer: tests.

## Risks / Trade-offs

- A bound the engine does not keep fails the suite until its change lands → proposed in the same tick, as with the combat floor.

## Open Questions

- None.
