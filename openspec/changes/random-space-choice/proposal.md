## Why

A random space is the one printed on the top clue token; when no clue token is left anywhere, the lead investigator chooses (glossary "Random space"; EH_reference.pdf p.11). The engine refuses the move in that case, telling the players what the rule is but giving them no way to do it. The nearest-space ties now ask the players; the empty-pool case is the same shape.

## What Changes

- Moving an investigator to a random space takes an optional named space, used only when no clue token is left; the Investigator effects group shows a space select then.
- **Deviations**: none for this move; spawns to a random space with an empty pool stay refused (separate change).
- Non-goals: random spawns of gates, clues and monsters.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `card-effects`: the lead's choice replaces the refusal when no clue token is left.

## Impact

- `src/engine/effects/investigator.ts`: `moveInvestigatorRandomly(state, content, id, chosen?)` and a helper telling whether a token is left; `src/table/effects/Investigator.tsx`: the select; tests. Engine and panel.
