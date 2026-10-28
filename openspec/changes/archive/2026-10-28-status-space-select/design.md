## Context

See proposal.md. `Panel` already receives `onSelect` and renders neighbour buttons with it; `Status` renders the space cell as text.

## Goals / Non-Goals

**Goals:**
- Reuse the existing select path.

**Non-Goals:**
- See proposal.

## Decisions

### D1. A button in the cell
`Status` takes `onSelect` and renders `<button type="button" onClick={() => onSelect(i.space)}>` around the space name, styled like the neighbour buttons. Route mode treats it as any selection, extending the draft when legal, as the space list does. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
