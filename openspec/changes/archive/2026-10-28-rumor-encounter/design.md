## Context

See proposal.md. `encounterFallen` sets `phase.card = { deck: "fallen", id }` and `discardDrawn` handles that deck specially; `state.rumors` lists token spaces; `ongoingMythos` and `mythosDiscard` exist; the Encounter panel shows draw buttons when no monster stands and no card is drawn.

## Goals / Non-Goals

**Goals:**
- Reuse the `phase.card` pattern for a deck-less encounter; one effect for the card.

**Non-Goals:**
- The rumor's text (see proposal).

## Decisions

### D1. `encounterRumor(state, content)` and deck `rumor`
Same gates as a draw; requires a rumor token on the active investigator's space, refusing "no rumor token lies on X"; sets `phase.card = { deck: "rumor", id: space }`; logs "resolves the rumor encounter on X: the rumor card's text is left to the players". `discardDrawn` does nothing for `rumor`. Layer: engine.

### D2. `discardOngoing(state, content, cardId)` in `effects.ts`
Behind `textPhase`; refuses "X is not in play"; moves the id from `ongoingMythos` to the front of `mythosDiscard`; logs "X is discarded from play". Layer: engine.

### D3. Panel
`Encounter.tsx`: Resolve rumor among the draw buttons when `state.rumors` includes the space; `Effects.tsx` Board group: a select of ongoing cards by name and Discard ongoing card. Layer: view.

## Risks / Trade-offs

- The invariant test counts mythos cards across deck, discard, ongoing and the card in play → the discard keeps the count.

## Open Questions

- None.
