## Context

See proposal.md. `piecesOnSpace` builds the pieces per space with an image path under `public/`; `Table.tsx` sizes pieces by kind. The set's tokens live under `cards/eh01/tokens/`.

## Goals / Non-Goals

**Goals:**
- Two image paths swapped, one piece added.

**Non-Goals:**
- The mystery token (see proposal).

## Decisions

### D1. Set art by set id
The token paths are built from `set.id` as the gate and clue tokens already are, so another set brings its own art. Layer: view model.

### D2. `lead` piece
After the pawns, `piecesOnSpace` adds `{ kind: "lead", id: "lead", image: tokens/lead-investigator.webp, label: "Lead investigator" }` on the lead's space when the lead is standing; sized like a clue. Layer: view model and table.
- Rejected: drawing the token on the pawn's billboard. A separate piece fans with the others and needs no pawn change.

## Risks / Trade-offs

- A defeated lead still holds `leadInvestigator` until the fall passes it → the piece follows the state's lead, which the engine keeps standing.

## Open Questions

- None.
