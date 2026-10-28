## Context

See proposal.md. Phase logs live on `EncounterPhase.log` and `MythosPhase.log`; `note` appends to them. The seat passes in `advance` (encounter), the Mythos card is drawn in `drawMythos` from the last encounter, and `nextRound` leaves the Mythos phase. `perform` in `actions.ts` records every action. `Status` in `Panel.tsx` renders the state beside the board.

## Goals / Non-Goals

**Goals:**
- Lines are copied, never moved: the phase log stays as it is while the phase runs; the journal grows at the three transitions and in `perform`.

**Non-Goals:**
- Filtering, export, setup lines (see proposal).

## Decisions

### D1. `JournalEntry { round, phase, who?, text }` and `GameState.journal`
Phase is `"action" | "encounter" | "mythos"`; `who` the investigator id for action and encounter lines, absent for Mythos lines; names are resolved in the view, so the engine stays free of the set. Setup starts with `[]`. Layer: game state.
- Rejected: pre-rendered strings with names. The Action phase helpers have no set to look names up.

### D2. `keepLog(state)` in `src/engine/journal.ts`
Returns the state with the current phase's log lines appended as entries for the current round and phase, `who` the encountering investigator; a no-op outside the Encounter and Mythos phases or with an empty log. Called at the top of `advance`, of `drawMythos` and of `nextRound`. Layer: engine.
- Rejected: writing to the journal inside `note`. Undo and the view already have the phase log; writing twice would double every line.

### D3. `perform` writes the action
`perform` appends `{ round, phase: "action", who: next.id, text: action }`. The delayed stand-up in `endTurn` is not an action and writes nothing. Layer: engine.

### D4. Journal section in the panel
`Panel.tsx`: after Status, a `<details>` with the summary "Journal (N lines)", listing per round a heading and the entries as "Encounter, Leo Anderson: draws from the america deck ..." in order. Layer: view.

## Risks / Trade-offs

- The journal grows for the whole game → a few hundred short strings; saved with the state, well under storage limits.

## Open Questions

- None.
