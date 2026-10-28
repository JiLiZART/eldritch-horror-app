## Context

See proposal.md. `App` keeps `history` (states before accepted steps) and Undo pops it; `act` pushes to it and saves.

## Goals / Non-Goals

**Goals:**
- A mirror stack, cleared by any accepted step.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `redo` stack
`useState<GameState[]>([])`: Undo pushes the current state onto it before restoring; Redo pops it, pushes the current state onto the history and restores; `act`, a switch, a load and a new game clear it. Not saved to the slot. Layer: view.

## Risks / Trade-offs

- Redo after a window-sync follow → the follow clears it too, since the state moved under it.

## Open Questions

- None.
