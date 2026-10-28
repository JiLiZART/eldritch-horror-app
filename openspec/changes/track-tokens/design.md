## Context

See proposal.md. `board.json` holds spaces in normalized texture coordinates and `boardToWorld` maps them onto the plane; `Table.tsx` draws pieces as billboards at space positions. Measured on the image: the doom numbers 20 to 0 run evenly from about x 0.028 to x 0.865 at y 0.035; the omen circle is centred near x 0.941, y 0.088 with the four spaces at radius 0.043 of the width, the green comet on top, then blue, red, blue clockwise.

## Goals / Non-Goals

**Goals:**
- Positions as data; pure geometry functions with tests; the same billboard drawing as the pieces.

**Non-Goals:**
- Dragging, reserve slots (see proposal).

## Decisions

### D1. `board.tracks`
`{ doom: { from: {x,y}, to: {x,y}, spaces: 21 }, omen: { center: {x,y}, radius: number } }` in normalized texture coordinates; `validateBoard` requires both, every coordinate within 0 to 1 and `spaces` at least 2. Layer: content.
- Rejected: measuring in code from the image. The board is data everywhere else.

### D2. `doomPosition(board, doom)` and `omenPosition(board, index)` in `geometry.ts`
Doom space `n` lies at `from + (spaces - 1 - n) / (spaces - 1) * (to - from)`, so 20 is at `from` and 0 at `to`; the omen space `i` lies on the circle at angle `90° - i * 90°`, so 0 is on top and the order runs clockwise; both return world coordinates through `boardToWorld`, the omen radius scaled by the board width. Layer: view geometry, tested.

### D3. Track pieces in the scene
A `Tracks` component beside `Pieces` draws the doom token at `doomPosition`, the omen token at `omenPosition(state.omen)`, and for each track space `eldritchOnOmen[i]` eldritch tokens fanned around the space at a small radius, from `cards/eh01/tokens/{doom,omen,eldritch}-token.webp`. `Table` gets a `tracks` prop built by `App` from the state: `{ doom, omen, eldritch }` or undefined without a game. Layer: view.

## Risks / Trade-offs

- The measured coordinates may sit a hair off the printed circles → verified by screenshot and adjusted in data.
- A doom above 20 (no Ancient One starts there) → clamped to the track's ends.

## Open Questions

- None.
