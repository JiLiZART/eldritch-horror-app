## Context

See proposal.md. Conditions are card ids in `InvestigatorState.conditions`; names come from `set.cards`. `travel` and `moveInvestigator` already refuse other things; `fight`, `drawEncounter` and `finishEncounter` gate on monsters and the waiting fight. `Encounter.tsx` renders the monster list, the draw buttons, the drawn card and Finish.

## Goals / Non-Goals

**Goals:**
- One predicate for "holds Detained"; refusals in the existing gates; the panel swaps the controls for the back image.

**Non-Goals:**
- Reading the back's text; other conditions (see proposal).

## Decisions

### D1. `isDetained(investigator)` by card id
In `src/engine/types.ts` beside `InvestigatorState`: true when any held condition id matches `/condition/detained-` followed by a number, the id shape `content-schema` fixes for every set. `travel` has no set to look names up, and the id is as stable as the name. Layer: engine.
- Rejected: a `detained` flag on the investigator. The card is the state; a flag would drift from the discard.
- Rejected: a name lookup through the set. It would push `set` into `travel` and its callers for one check.

### D2. Refusals in the existing gates
`travel` throws "a Detained investigator cannot move" after `mayAct`; `moveInvestigator` throws the same after `subject`. `fight` and `drawEncounter` throw "a Detained investigator resolves the back of the condition instead"; `finishEncounter` skips the unfought-monster check for a Detained investigator. Layer: engine.
- Rejected: skipping the Detained investigator's encounter turn. The back is an encounter of its own and may hand out clues or discard the card.

### D3. The back in the panel
`Encounter.tsx`: when the active investigator is Detained, render the Detained card's back image with "resolves the back of Detained instead of an encounter" in place of the monster list and the draw row; Finish stays enabled; Effects stay for the back's text. The footer line about Detained goes. 2D panel only. Layer: view.
- Rejected: a Detained mark on the pawn. The Status table already lists conditions.

## Risks / Trade-offs

- A Detained investigator with a monster on the space finishes without fighting → per the rules; the monster stays for the next round.

## Open Questions

- None.
