## Context

See proposal.md. `solveMystery` in `src/engine/ancientOne.ts` moves the current mystery to the solved pile; `Status` shows the mystery image with the solved count; the Ancient One group in `Effects.tsx` holds doom and mystery buttons.

## Goals / Non-Goals

**Goals:**
- One number on the state, one effect, two buttons.

**Non-Goals:**
- Reading thresholds or kinds (see proposal).

## Decisions

### D1. `mysteryTokens: number`
Setup starts at 0; `solveMystery` sets it back to 0 as the next mystery becomes current. Layer: game state.
- Rejected: a count per kind. The card names the kind; the engine cannot check it, and one number is what the players count.

### D2. `changeMysteryTokens(state, delta)`
Behind `textPhase`; refuses below 0 with "the mystery holds no token"; logs "a token is placed on the mystery (N)" or "removed from the mystery (N)". Layer: engine.

### D3. Panel
`Status`: "N tokens" beside the solved count; `Effects.tsx` Ancient One group: Place token on mystery, Remove token. Layer: view.

## Risks / Trade-offs

- A solved mystery's tokens vanish rather than returning to pools → the rules discard them; clue tokens discarded this way join no pool today, consistent with spent clues.

## Open Questions

- None.
