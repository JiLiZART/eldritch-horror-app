## Context

See proposal.md. `Sheets` draws each sheet as a `Face` at `sheetPosition`; the stamps sit at fixed fractions of the sheet; the numbered tokens are `cards/eh01/tokens/health/health-0N.webp` and `sanity/sanity-0N.webp`, 365 by 386.

## Goals / Non-Goals

**Goals:**
- Two token meshes per sheet, no new geometry helper.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Fixed stamp fractions
The heart's centre is at (0.59, 0.57) of the sheet from its top-left, the brain's at (0.83, 0.57); the token is 0.42 wide, 0.42 by 386 / 365 high, drawn 0.01 above the sheet. A plain mesh with no click, so a click there focuses the sheet. Layer: view.
- Rejected: per-investigator stamp positions in content. The core sheets share one layout.

### D2. Prop
`TableProps.sheets[]` gains `health` and `sanity`; `App.tsx` passes `Math.min(9, value)`. Layer: view.

## Risks / Trade-offs

- A sheet layout that differs in an expansion → the fractions move to content then; not now.

## Open Questions

- None.
