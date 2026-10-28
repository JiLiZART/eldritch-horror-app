## Context

See proposal.md. `activeGraph(board, enabled)` gives the spaces and paths of enabled sets; the engine takes a `Board` through `Content`; the table draws from the full board with `enabled` for the view.

## Goals / Non-Goals

**Goals:**
- One board object for play, built once; nothing in the engine changes.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `playBoard` in `App`
`useMemo(() => ({ ...board, ...activeGraph(board, new Set(["eh01"])) }), [board])` is what `setupGame`, `travel`, every `onAct` content and `piecesOnSpace` receive; the `Table` keeps the full board and `enabled`. Layer: view.

### D2. Tests on the same board
The fuzz test builds its content with the same core graph and bounds spaces to it; an actions test asserts the Istanbul to Cairo refusal. Layer: tests.

## Risks / Trade-offs

- A saved game that already stands on an expansion space → impossible before this change only through those moves; such a state would refuse further moves until the pawn is moved by card text to a known space.

## Open Questions

- None.
