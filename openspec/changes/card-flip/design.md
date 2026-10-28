## Context

See proposal.md. `CardFace` is image and label; `Face` keeps hover and handles the click that focuses; a card's content has `images.back` when double-sided; `Scene` knows which face is focused by its key.

## Goals / Non-Goals

**Goals:**
- A turned flag on the focused face, textures for both sides loaded when a back exists.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `CardFace.back?: string`
`App.tsx` passes `images.back` for held and reserve cards (and the mystery and mythos cards when the content has one); the texture lists include backs. Layer: view model.

### D2. Turn on the second click
`Face` takes `focused: boolean` from `Scene` (its position equals the focus position) and a `turned` state it toggles on a click while focused and a back exists; putting the card down (focus leaves) resets it; the mesh shows the back texture while turned. Layer: view.

## Risks / Trade-offs

- Loading back textures doubles the reserve and held images fetched → small webp files.

## Open Questions

- None.
