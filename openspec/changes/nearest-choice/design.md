## Context

See proposal.md. `nearest(board, from, candidates)` returns the first candidate at the smallest distance; `moveInvestigatorToNearest` calls it; the effects group has a Move to nearest control with a kind select.

## Goals / Non-Goals

**Goals:**
- The engine knows the tie set and refuses a non-member; the panel asks only when needed.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `nearestAll` in the board graph
`nearestAll(board, from, candidates)` returns every candidate at the smallest distance, in board order; `nearest` becomes its first element. Pure, tested. Layer: content graph.

### D2. Optional choice in the effect
`moveInvestigatorToNearest(state, content, id, kind, chosen?)`: with one nearest space it moves there; with several and `chosen` among them it moves there; with several and no or a wrong `chosen` it throws naming the nearest spaces. Fuzz keeps passing by catching the refusal as today. Layer: engine.

### D3. The panel asks
The Investigator group computes `nearestAll` for the chosen kind; with several it shows a select of them beside the control and passes the pick. Layer: panel.

## Risks / Trade-offs

- A refusal where the game once moved silently → the panel never issues the call without a pick when several tie.

## Open Questions

- None.
