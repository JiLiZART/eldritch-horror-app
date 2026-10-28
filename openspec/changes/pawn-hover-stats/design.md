## Context

See proposal.md. `piecesOnSpace` builds pawn pieces from `state.investigators` with the translator; the badge shows `hint` as a second line.

## Goals / Non-Goals

**Goals:**
- One string, one field.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Pawn hint
`hint = t("piece.investigatorHint", { health, sanity, clues })` ("{health} health, {sanity} sanity, {clues} clues"; Russian with the glossary's words for health, sanity and clue). `pieces.test.ts` covers it. Layer: view model.

## Risks / Trade-offs

- None.

## Open Questions

- None.
