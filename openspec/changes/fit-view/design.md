## Context

See proposal.md. `CameraTarget` carries a position, an optional card size and a key; the rig derives `minZoom` from the table extent and glides position and zoom; the panel's strings live in `content/panel/i18n` with parity checked.

## Goals / Non-Goals

**Goals:**
- Reuse the glide; one counter prop threads the request.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `fit` counter
`TableProps.fit?: number`; `App.tsx` keeps a counter bumped by the panel button. `Scene` turns a changed counter into a target `{ position: extent centre, fit: true, key }` that outranks the focus and the selection until the next of either; the rig treats `fit` as `zoomGoal = minZoom`. Layer: view.
- Rejected: resetting the controls directly through a ref. The glide, the clamp and reduced motion already live in the rig's target path.

### D2. Button and string
A `panel.fitTable` string in both languages; the button sits in the Game section beside Undo. Layer: panel.

## Risks / Trade-offs

- Fit while a glide runs → the newer target wins, as for any target change.

## Open Questions

- None.
