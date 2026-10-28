## Context

See proposal.md. `Sheets` has a `token(seat, image, fx, fy)` helper placing a mesh at a fraction of the sheet; the skill boxes sit in a row along the sheet's bottom; `InvestigatorState.improvements` holds 1 or 2 per skill, `tickets` up to two of `train` or `ship`.

## Goals / Non-Goals

**Goals:**
- Reuse the stamp helper; no geometry change.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Fractions
Skill boxes at fx 0.123, 0.29, 0.458, 0.626, 0.793 for lore, influence, observation, strength, will, fy 0.888; a token 0.3 wide, the second of a pair offset 0.06 right and up. Tickets at fx 0.93, fy 0.07 and 0.17, 0.26 wide, images `travel/train.webp` and `travel/ship.webp`. The helper takes a size and an offset. Layer: view.

### D2. Prop
`TableProps.sheets[]` gains `improvements: Partial<Record<Skill, 1 | 2>>` and `tickets: Ticket[]`, passed straight from the state. Layer: view.

## Risks / Trade-offs

- Tokens over the printed skill number hide it → the token shows the bonus and the number peeks beside it; the status table keeps the sum.

## Open Questions

- None.
