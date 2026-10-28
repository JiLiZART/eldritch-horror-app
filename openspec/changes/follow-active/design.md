## Context

See proposal.md. `App.tsx` keeps `selected` and `route`; `CameraRig` in `Table.tsx` flies to the selected space; the phases carry `active` in the Action and Encounter phases.

## Goals / Non-Goals

**Goals:**
- One effect, no new state.

**Non-Goals:**
- Following other moves (see proposal).

## Decisions

### D1. An effect keyed on the active investigator's id
`useEffect` on `[activeId, route === undefined]`: when the phase is Action or Encounter and no route is being picked, `setSelected` to the active investigator's space. Keyed on the id, not the space, so a player's own travel does not keep re-centring. Layer: view.
- Rejected: following every state change. Card-text moves of other investigators would yank the camera mid-step.

## Risks / Trade-offs

- The effect also fires on load of a resumed game → it selects the active investigator's space, which is the useful default.

## Open Questions

- None.
