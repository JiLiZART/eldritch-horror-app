## Context

See proposal.md. `GameState` (`src/engine/types.ts`) is plain data built once by `setupGame`; nothing mutates it yet. `App` holds it in `useState`; `Panel` and `Table` render from it. Setup refuses bad input by throwing `Error` with the rule's words, and `NewGame` shows that message. The board graph (`src/content/board.ts`) gives `neighbors` and path types.

## Goals / Non-Goals

**Goals:**
- Actions are pure functions on `GameState` that either return the next state or throw the rule they break, so every rule is unit-testable without the view.
- The view adds only drafts (a route being chosen, a trade being filled in) and never rule logic.

**Non-Goals:**
- Encounter and Mythos phases, Acquire Assets, component actions (see proposal non-goals).
- Undo or history.

## Decisions

### D1. The turn lives in game state
`GameState` gains `round: number`, `phase: { name: "action"; active: string; taken: ActionName[] }` and `InvestigatorState.tickets: Ticket[]` (`Ticket = "train" | "ship"`). `setupGame` starts round 1 with the lead active. Layer: game state.
- Rejected: keeping the active seat in React state. Turn order and the two-action limit are rules; they need tests and later a replay.
- Consequence: `setup.test.ts` grows a case; `phase.name` is a union with one member today so later phases extend it.

### D2. One pure function per action in `src/engine/actions.ts`
`travel(state, board, route: string[])`, `rest(state, set)` (the set supplies the sheet maximums), `prepareForTravel(state, board, ticket, discard?)`, `trade(state, { partner, give, receive })`, `endTurn(state)`. Each checks the active investigator may still act, checks its own rule, and returns a new state with the action recorded in `phase.taken`. Errors carry the rule text (same pattern as `setupGame`). Layer: engine.
- Rejected: a single `reduce(state, action)` over a discriminated union. Typed parameters per function read better in tests; a union wrapper can be added for replay later without touching rules.
- Consequence: the view calls an action inside `try` and shows `Error.message`, exactly as `NewGame` does.

### D3. A travel route is one action
The whole route is validated and applied at once: step 1 must be adjacent by any path, each further step spends one held ticket whose type equals the path type of that step. The route being picked is view state (`string[]` in `App`), appended by selecting spaces; legality of a draft is checked by running `travel` on a copy inside `try` (no duplicated rule), confirmed with one call. Layer: engine for rules, view for the draft.
- Rejected: `travel` per step with a "travelling" flag in game state. It leaks a half-resolved action into the state and complicates "each action fully resolved".
- Rendering: route spaces reuse the existing 3D `Marker` with a third colour; no new table element. 2D for everything else.

### D4. Trade is one action in both directions
`give` and `receive` each list possession ids, a clue count and tickets. The engine checks the partner shares the space and that each side holds what it gives. Player agreement is offline. Layer: engine; the form is view state. 2D in the panel.
- Rejected: offer/accept in two steps. One screen, no network.

### D5. End of the last turn starts the next round (deviation)
`endTurn` after the last seat sets `round + 1`, `phase.active` back to the lead, `taken` empty. The panel shows "Encounter and Mythos phases are not modelled yet". Layer: engine with the deviation named in the spec.
- Rejected: stopping the game at the end of the Action phase. Players could not test travel over several rounds.

### D6. Turn controls are a 2D panel section
`Turn` component: round, phase, active investigator, actions left, tickets; buttons Travel (enters route picking), Rest, Prepare for Travel (train, ship), Trade (opens the form), End turn; one `aria-live` error line. `App` owns `game`, `route` and the action dispatch `act(fn)` that wraps `try`. Layer: view.
- Rejected: buttons on the 3D table. Text and forms belong in DOM for accessibility.

### D7. Third ticket replaces a named one
`prepareForTravel` takes `discard?: Ticket`; required when the investigator already holds 2. Layer: engine.
- Rejected: refusing the action. The printed rule lets a player gain a ticket and discard down; refusing would be a deviation.

## Risks / Trade-offs

- Route picking reuses space selection, so selecting a space to read its details is unavailable while a route is being picked. Mitigation: a Cancel button leaves route mode.
- `GameState` is copied per action with spread; fine at this size, revisit if replay stacks thousands of states.

## Open Questions

- None.
