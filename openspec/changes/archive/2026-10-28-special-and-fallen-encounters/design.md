## Context

See proposal.md. `allowed` in `encounter.ts` says which deck a space permits; `drawEncounter` reads `decks.research` or `decks.encounters[deck]`; `finishEncounter` discards `phase.card` to `encounterDiscards[deck]`. Research is its own deck on `decks`; the Ancient One's `special` cards are content only. A defeated investigator keeps `defeated`, `space` and `possessions`; `pieces.ts` draws every non-devoured pawn.

## Goals / Non-Goals

**Goals:**
- Special as one more deck in the research pattern; the fallen encounter as a `phase.card` of deck `fallen` whose id is the investigator.

**Non-Goals:**
- Rumor encounters (see proposal).

## Decisions

### D1. `decks.special: string[]`
Shuffled from the Ancient One's `special` at setup, empty without one. `allowed` permits `special` anywhere when the Ancient One has special cards; `drawEncounter` and `replenish` treat it as `research` is treated; `finishEncounter` discards to `encounterDiscards.special`. `STATE_VERSION` goes to 4. Layer: game state and engine.

### D2. `encounterFallen(state, content, fallen)` and deck `fallen`
Same gates as a draw (no unfought monster, no card yet, not Detained); `fallen` must be a defeated, non-devoured, non-removed investigator on the active one's space; sets `phase.card = { deck: "fallen", id: fallen }` and logs "resolves the back of X's sheet". `finishEncounter` on deck `fallen` marks that investigator `removed: true` instead of discarding anything, logging that the token and sheet leave the game. Layer: engine.
- Rejected: a separate phase field. The one-encounter rule already lives on `phase.card`.

### D3. `takePossessions(state, content, to, from)` in `effects.ts`
Behind `subject`; `from` must be defeated and on `to`'s space with possessions left; moves them all and logs. Layer: engine.

### D4. Panel and pieces
`Encounter.tsx`: Draw special among the draw buttons when the deck exists; for each fallen token on the space a button "Resolve X's encounter"; with `phase.card.deck === "fallen"` the sheet back image and Take possessions. `pieces.ts` skips `removed`; `Status` marks "(removed)". Layer: view.

## Risks / Trade-offs

- A removed investigator not yet replaced still gets a replacement at the end of the Mythos phase → correct per the rules.

## Open Questions

- None.
