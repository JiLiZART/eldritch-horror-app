## Context

See proposal.md. `Face` draws a card with `meshBasicMaterial`; the sheets prop carries each investigator's cards and numbers; `InvestigatorState.defeated` marks the fall.

## Goals / Non-Goals

**Goals:**
- One flag, one material colour.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `dim` on the face
`FaceProps.dim?: boolean` sets the material `color` to a grey (`#777`) so the texture multiplies darker; `sheets[].defeated` from `App.tsx` makes `Sheets` pass `dim` to the sheet and its held cards. Layer: view.

## Risks / Trade-offs

- None.

## Open Questions

- None.
