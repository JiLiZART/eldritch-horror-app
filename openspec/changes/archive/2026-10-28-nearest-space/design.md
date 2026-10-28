## Context

See proposal.md. `distance(board, from, to)` in `src/content/board.ts` counts paths on the shortest route. `defeat` folds over the cities with `distance` to find the nearest. `moveInvestigator` moves to a named space. Space kinds are city, wilderness and sea; gates and clues are space-id lists on the state.

## Goals / Non-Goals

**Goals:**
- One nearest helper shared by defeat and card text; one effect; one select.

**Non-Goals:**
- Nearest for monsters or spawns (see proposal).

## Decisions

### D1. `nearest(board, from, candidates)` in `board.ts`
Returns the candidate with the smallest `distance`, the first in `candidates` order on a tie, `undefined` for no candidates; `from` itself wins at distance 0. Candidates are passed in board order by every caller. Layer: content helpers.

### D2. `moveInvestigatorToNearest(state, content, id, target)`
`target` is `"city" | "wilderness" | "sea" | "gate" | "clue"`. Candidates: the board's spaces of that kind, or `state.gates`, or `state.clues`, each filtered to board order. No candidate: "no space with a gate exists" or "no city space exists". A match on the own space logs "X is already on the nearest city"; else logs the move through `moveInvestigator`. Layer: engine.
- Rejected: a predicate parameter. Five named targets keep the panel a plain select.

### D3. `defeat` calls `nearest`
The fold over cities becomes `nearest(board, me.space, cities)!`. Layer: engine.

### D4. Panel
`Effects.tsx` Investigator group: a select of the five targets and Move to nearest. Layer: view.

## Risks / Trade-offs

- Ties are silent → the log names the space; Move covers the players' choice.

## Open Questions

- None.
