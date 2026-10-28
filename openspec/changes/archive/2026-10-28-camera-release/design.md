## Context

See proposal.md. `CameraRig` in `Table.tsx` eases `controls.target` toward `goal` in `useFrame` whenever they differ; MapControls emits `start` when the user begins a drag.

## Goals / Non-Goals

**Goals:**
- One glide per selection; the rig otherwise leaves the controls alone.

**Non-Goals:**
- See proposal.

## Decisions

### D1. A gliding ref
A `useRef(false)` flag turns on in an effect keyed on `goal` and off when the frame step lands within 0.001 of it, or in MapControls' `onStart`. `useFrame` returns early unless the flag is on. Reduced motion still lands in one step. Layer: view.
- Rejected: comparing the previous and current goal inside `useFrame`. The effect already marks the change and keeps the frame loop a plain step.

## Risks / Trade-offs

- A selection that equals the current target starts no visible glide → the flag clears on the first frame, nothing moves; correct.

## Open Questions

- None.
