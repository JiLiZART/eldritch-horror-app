## Context

See proposal.md. The document keydown listener handles arrows, zoom and Escape and skips fields; the Undo and Redo handlers live inline on `NewGame`'s props.

## Goals / Non-Goals

**Goals:**
- Lift the two handlers into named functions and call them from the keys.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Named handlers and keys
`undo()` and `redo()` become functions in `App` used by both the buttons and the listener; the listener matches `(e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z"` (Shift for redo) or `"y"` for redo, prevents the default, and ignores the keys when nothing can be undone or redone. The `game.keys` string gains the undo keys. Layer: view and content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
