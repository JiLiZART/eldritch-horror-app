## Context

See proposal.md. `Face` is one mesh in a `Billboard` with a click handler; `Pieces` keeps a hover state and renders one `Html` badge styled `.piece-label`; the table props carry image paths only.

## Goals / Non-Goals

**Goals:**
- Names travel with the images; each face owns its hover.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Faces carry `{ image, label }`
`tracks.reserve`, `tableau.sheet`/`mystery`/`mythos`, `sheets[].image` and `sheets[].held` become `{ image: string; label: string }` (the reserve label "name · value {n}" through the panel's `status.value` string). `App.tsx` builds them from the content. Layer: view model and props.

### D2. `Face` hover
`Face` keeps its own `hovered` state from pointer over and out, with `stopPropagation` as the pieces do, and renders the same `Html` badge above its top edge while hovered. Layer: view.
- Rejected: a shared hover in `Scene`. Faces never overlap pieces, so independent states cannot show two badges at once for one pointer.

## Risks / Trade-offs

- Prop shape change touches every caller → `App.tsx` and `Table.tsx` only; the geometry tests do not see props.

## Open Questions

- None.
