## Context

See proposal.md. `MythosPhase.card` is the drawn card's id; `App.tsx` builds `tableau.mythos` from `state.ongoingMythos`; `Tableau` lays the list in a row.

## Goals / Non-Goals

**Goals:**
- One list prepend; no table change.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Prepend in `App.tsx`
When `phase.name === "mythos"`, the mythos list is `[phase.card, ...ongoingMythos.filter((id) => id !== phase.card)]`, mapped to faces as today, so a card that is also ongoing is not laid twice. Layer: view model.

## Risks / Trade-offs

- None.

## Open Questions

- None.
