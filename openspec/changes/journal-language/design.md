## Context

See proposal.md. `Journal` in `Panel.tsx` maps `e.phase` to a literal and prefixes `component:` lines with a literal; `useT()` is already in scope.

## Goals / Non-Goals

**Goals:**
- Four strings, one component.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Keys
`journal.action`, `journal.encounter`, `journal.mythos` (the glossary's phase names, "Action" and so on in English) and `journal.component` ("component action: {name}"). Layer: panel and content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
