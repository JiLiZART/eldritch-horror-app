## Context

See proposal.md. `NewGame` renders Abandon game and, per slot, Switch and Remove, calling the handlers at once.

## Goals / Non-Goals

**Goals:**
- One pending-action state, no dialogs.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Pending action
`useState<{ kind: "abandon" } | { kind: "remove"; id: string }>()`; the pressed button is replaced by Confirm and Cancel buttons while pending; Confirm runs the handler and clears; Cancel clears; starting any other action clears too. Layer: panel.
- Rejected: `window.confirm`. A modal dialog blocks the page and reads poorly on a shared screen.

## Risks / Trade-offs

- Browser checks that press Remove once → they now press Confirm after.

## Open Questions

- None.
