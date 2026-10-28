## Context

See proposal.md. The Game section in `NewGame` holds the Undo, Fit table and Save controls while a game runs.

## Goals / Non-Goals

**Goals:**
- One string, one `<small>` line.

**Non-Goals:**
- See proposal.

## Decisions

### D1. The line
`game.keys` ("Keys: arrows pan, + and − zoom, Esc clears the selection"), rendered as a `<p><small>` under the Game buttons whether or not a game runs. Layer: panel and content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
