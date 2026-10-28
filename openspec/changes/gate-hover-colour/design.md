## Context

See proposal.md. `piecesOnSpace` builds gate pieces per `state.gates`; `Space.gate` is the colour; `OMEN_TRACK[state.omen]` is the current colour; the omen colour names exist as `omen.<colour>` strings; monster pieces already carry a `hint` the badge shows.

## Goals / Non-Goals

**Goals:**
- Reuse the hint line.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Gate hint
`piecesOnSpace` takes the board too (it has the set and the state; the board gives the space's colour): `hint = t("gate.<colour>")` (its own strings, since Russian declines the colour with the plural noun) plus `", " + t("piece.matchesOmen")` when the colour equals `OMEN_TRACK[state.omen]`. A space without a printed gate colour gets no hint. `pieces.test.ts` covers both branches. Layer: view model.

## Risks / Trade-offs

- `piecesOnSpace` gains a parameter → its three call sites (App, tests) change in step.

## Open Questions

- None.
