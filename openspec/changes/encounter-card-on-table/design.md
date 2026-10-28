## Context

See proposal.md. `EncounterPhase.card` names the deck and card drawn, which `Encounter.tsx` already resolves to an image; `Sheets` lays each sheet with its held cards; `tableExtent` bounds the sheet row's width by the last sheet.

## Goals / Non-Goals

**Goals:**
- One more face per sheet, positioned by a small helper.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `sheets[].encounter?: CardFace`
`App.tsx` resolves the phase's card the way `Encounter.tsx` does and attaches it to the active investigator's sheet entry. Layer: view model.

### D2. Position
`encounterPosition(board, seat)`: the sheet's right edge plus the held gap, centred on the sheet's vertical centre, at `HELD` size, tested in `geometry.test.ts`; the extent's `maxX` includes it when set (the last sheet plus a card width). Layer: 2D geometry and view.

## Risks / Trade-offs

- The card sits between two sheets' columns → the sheet gap is 0.2 and the card 0.7 wide, so the row's sheet gap grows to hold a card between sheets, which widens the row by 0.5 per seat.

## Open Questions

- None.
