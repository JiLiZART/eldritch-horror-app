## Context

See proposal.md. `Monster.combat` holds `will?: { modifier, horror }`, `strength?: { modifier, damage }`, `toughness?` and `onAncientOneSheet` for the cultist, whose values are `AncientOne.cultists`; `Piece.label` is one string; the hover badge is one `Html` span.

## Goals / Non-Goals

**Goals:**
- Numbers in the badge, names unchanged elsewhere.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `hint` on the piece
`Piece.hint?: string`, set for monsters from the combat values (the cultist's resolved from the sheet of the game's Ancient One), through the translator: `piece.will` ("Will {modifier}, horror {horror}"), `piece.strength` ("Strength {modifier}, damage {damage}"), `piece.toughness` ("toughness {toughness}"), joined with " · ", a signed modifier. `pieces.test.ts` covers a token and the cultist. Layer: view model.

### D2. Two-line badge
The badge shows the label and, below it, the hint in a smaller line. Layer: view.
- Rejected: folding the numbers into `label`. The panel's piece list would grow unreadable.

## Risks / Trade-offs

- A monster whose combat values are absent in content shows only its name → correct, nothing to show.

## Open Questions

- None.
