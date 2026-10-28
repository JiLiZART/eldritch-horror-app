## Context

See proposal.md. `Panel` maps `PATH_COLORS` to swatches; `shownBoard` already holds the paths of the enabled sets (engine-core-board D1).

## Goals / Non-Goals

**Goals:**
- One pure helper, one filter in the legend.

**Non-Goals:**
- See proposal.

## Decisions

### D1. The helper
`pathTypes(paths: Path[]): PathType[]` in `src/table/sets.ts` returns the `PATH_COLORS` keys that occur among `paths`, in key order. `Panel` renders a swatch per returned type. Layer: panel.

## Risks / Trade-offs

- None.

## Open Questions

- None.
