## Context

See proposal.md. `Tracks` draws the doom, omen and eldritch tokens as meshes in billboards from `tracks`; `Face` and `Pieces` own hover badges; `status.omenLine` already phrases the omen with its count.

## Goals / Non-Goals

**Goals:**
- Labels in the prop, one hover per token.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Labels in `tracks`
`tracks` gains `labels: { doom: string; omen: string; eldritch: string[] }` built in `App.tsx` with the panel translator: `track.doom` ("Doom {doom}"), `track.omen` ("Omen: {omen}, {count} eldritch"), `track.eldritch` ("Eldritch token on the {omen} omen space"). Layer: view model and content.

### D2. A hoverable token
The `token` helper in `Tracks` takes a label and keeps a hovered state per token the way `Face` does, rendering the badge above the token. Layer: view.

## Risks / Trade-offs

- None.

## Open Questions

- None.
