## Context

See proposal.md. The panel's phase headings already come from strings (`panel.round`, the phase panels' headings, `app.win`, `app.lose`); `main.table` wraps the canvas.

## Goals / Non-Goals

**Goals:**
- Plain DOM over the canvas; no 3D text.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `status` prop on `Table`
`TableProps.status?: string` rendered as a `div.table-status` positioned over the canvas's top-left corner, `pointer-events: none`, styled like the badges. `App.tsx` builds it: round and phase from the existing strings (`panel.round`, `journal.action` and friends), the active investigator's name, or the win or loss heading. Layer: view.

## Risks / Trade-offs

- The line overlaps the board's top-left corner at full zoom-out → the corner holds the printed rules box, not a space; the line is small.

## Open Questions

- None.
