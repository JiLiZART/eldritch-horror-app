## Context

See proposal.md. `defeat` in `src/engine/encounter.ts` already advances doom, skips the seat, passes the lead, checks the loss and advances the encounter; its relocation and condition reshuffle are the defeat-specific part. `discardCard` in `effects.ts` knows which pile each card goes to. `pieces.ts` draws a pawn for every investigator; `Status` prints "(defeated by health)". Replacement keys on `defeated` without `replacedBy`.

## Goals / Non-Goals

**Goals:**
- Devoured as one more `defeated` value, so every seat-skipping, lead, loss and replacement rule applies unchanged.

**Non-Goals:**
- Lost in Time and Space (see proposal).

## Decisions

### D1. `defeated: "devoured"`
`InvestigatorState.defeated` becomes `"health" | "sanity" | "devoured"`. `turnOrder`, `nextStanding`, `replaceInvestigator`, the loss check and the Status mark need no new branch beyond wording. Layer: game state.
- Rejected: a separate `devoured: true`. Every rule that skips the defeated would need a second check.

### D2. `devour(state, content, id)` in `effects.ts`, `fallen` shared
The defeat-specific tail of `defeat` (doom, lead, loss, advance) is split into `fall(state, content, id, fallen)`, which `defeat` calls with the relocated investigator and `devour` with the emptied one: cards to their piles via `discardCard`'s rule, `clues: 0`, `tickets: []`, `improvements: {}`, `defeated: "devoured"`. The pawn stays at its last space id but is not drawn (D3). The log says "Leo Anderson is devoured". Layer: engine.
- Rejected: calling `discardCard` per held card. It is gated on the phase and logs each discard; one pile split in `devour` is shorter.

### D3. No pawn, a mark, a button
`pieces.ts` skips investigators with `defeated === "devoured"`; `Status` prints "(devoured)" with the replacement when any; `Effects.tsx` adds Devour to the Investigator group. Layer: view.

## Risks / Trade-offs

- A devoured investigator keeps a stale `space` → only `pieces.ts` and the nearest-city rule read it, and both skip the devoured.

## Open Questions

- None.
