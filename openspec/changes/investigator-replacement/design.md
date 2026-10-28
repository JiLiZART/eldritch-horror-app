## Context

See proposal.md. `placeInvestigator` in `src/engine/setup.ts` builds an `InvestigatorState` from the sheet, taking starting cards out of deck copies and clues out of the pool copy. `nextRound` in `mythos.ts` already refuses a defeated lead. `defeat` leaves the fallen entry in `investigators` with `defeated` set and its possessions. `Mythos.tsx` shows the lead select after the log.

## Goals / Non-Goals

**Goals:**
- Reuse the setup builder; the fallen entry stays as the lying token; the newcomer is one more entry.

**Non-Goals:**
- Devoured, Lost in Time and Space (see proposal).

## Decisions

### D1. `replacedBy?: string` on the fallen entry
The fallen `InvestigatorState` keeps `defeated` and gains `replacedBy` with the newcomer's id. The newcomer is inserted right after the fallen entry, so `turnOrder` (which skips the defeated) seats them where the player sat. Layer: game state.
- Rejected: swapping the entry. The token and the set-aside possessions must stay on the board.

### D2. `replaceInvestigator(state, content, fallen, newcomer)` in `mythos.ts`
Requires the resolved Mythos phase; refuses when `fallen` is not defeated ("X is standing"), already replaced, or unknown; when `newcomer` is in `investigators` ("Y is already in the game") or not in the set; when `awakened` ("defeated investigators are eliminated after the awakening"). Copies `decks` and `cluePool`, calls the exported `placeInvestigator`, writes the copies back, inserts the entry, marks `replacedBy`, logs "Y takes X's seat". Layer: engine.
- Rejected: automatic replacement with the first unused sheet. The choice is the player's.

### D3. `nextRound` waits
Before the lead check: a defeated entry without `replacedBy`, no `awakened`, and at least one set investigator not in the game → "a defeated investigator is replaced first". Layer: engine.

### D4. Panel
`Mythos.tsx`: after the log, one row per unreplaced fallen investigator: a select of unused sheets and Replace. `Status`: "(defeated, replaced by Y)". `Encounter.tsx` footer: drop the clause. 2D only. Layer: view.
- Rejected: a new pawn kind for the newcomer. `pieces.ts` already draws every entry from state.

## Risks / Trade-offs

- Starting cards may be gone from a deck → `placeInvestigator` throws "no copy of X left"; the panel shows it and another sheet can be chosen.
- A second defeat of the same player's new investigator works the same way, since the newcomer is an ordinary entry.

## Open Questions

- None.
