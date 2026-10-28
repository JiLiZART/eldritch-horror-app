## Context

See proposal.md. `mayAct` refuses a third action and a repeated `ActionName`; `perform` records the action on the phase and in the journal; the phase's `taken` resets at each seat. Investigator sheets are content entries with ids; possessions are card ids.

## Goals / Non-Goals

**Goals:**
- Reuse `mayAct` and `perform`; one state list for the round; one select.

**Non-Goals:**
- The action's text (see proposal).

## Decisions

### D1. `ActionName` gains `` `component:${string}` ``
The component's id after the prefix, so `mayAct` keeps "each action once" per component and counts it among the 2. Layer: game state.
- Rejected: a separate counter. `taken` already does both checks.

### D2. `GameState.usedComponents: string[]`, cleared in `nextRound`
Per round and for every investigator, as the rule says; `STATE_VERSION` goes to 3. Layer: game state.
- Rejected: keeping it on the phase. The phase is rebuilt for every seat.

### D3. `componentAction(state, set, component)`
Reach: the active investigator's own id (the sheet), their possessions, or a possession of a standing investigator on their space. Refuses "X is not within reach" and "X was used this round", then `mayAct` with the prefixed name and `perform` with the investigator unchanged; `usedComponents` gains the id. Names come from `set.cards` or `set.investigators`. Layer: engine.

### D4. Turn select and journal name
`Turn.tsx`: a select of reachable components labelled by name ("Leo Anderson's sheet", "Hired Muscle (Lily Chen)") and Component action. `Panel.tsx`'s journal shows `component:<id>` as "component action: <name>". Layer: view.

## Risks / Trade-offs

- Older saves lack `usedComponents` → the version bump sets them aside.

## Open Questions

- None.
