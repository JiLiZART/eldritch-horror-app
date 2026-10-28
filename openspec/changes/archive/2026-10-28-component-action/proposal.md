## Why

Many assets, spells and every investigator sheet print an action: "Action: test Observation to gain a Clue", "Action: recover 2 health". The Action phase offers Travel, Rest, Trade, Prepare for Travel and Acquire Assets, so a component action can only be faked by ending the turn early, and nothing stops the same card twice in a round (`inspired/manual_eng.pdf` p.3 "Component actions"; `inspired/EH_reference.pdf` p.7 "Особое действие", p.6 "Местное действие").

## What Changes

- Component action: the active investigator uses their sheet, one of their possessions, or a possession of another investigator on their space; it counts as one of the 2 actions; each component is used at most once per round by anyone; the printed text is applied by the players with the usual effects.
- The round's used components are kept in the state and cleared when the next round starts; the journal records the component.
- The turn offers a choice of reachable components with a Component action button.
- **Deviations**: the engine does not read whether a card prints an Action or a Local Action; set-aside sheets of defeated investigators are out of reach.
- Non-goals: the action's text, reserve cards, conditions (they print no action).

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `action-phase`: a component action is performed once per component per round.

## Impact

- `src/engine/types.ts`: `ActionName` gains `component:<id>`, `GameState.usedComponents`, `STATE_VERSION` 3; `src/engine/actions.ts`: `componentAction`; `src/engine/mythos.ts`: `nextRound` clears the list; `src/table/Turn.tsx`: the select and button; `Panel.tsx`: the journal names the component. 2D panel only.
- `content/rules/glossary.md`: Component Action exists; no new terms.
