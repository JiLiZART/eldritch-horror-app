## Context

See proposal.md. `Glossary` already reads `useT` for its summary; the space and journal filters use `aria-label` and `placeholder` from one key.

## Goals / Non-Goals

**Goals:**
- Two keys, no new structure.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Keys
`panel.filterGlossary` as the search box's `aria-label` and `placeholder`, replacing the bare "Filter" label; `glossary.unofficial` for the marker. The coverage test in `lang.test.ts` sees both literal keys. Layer: panel and content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
