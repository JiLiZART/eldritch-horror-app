## Context

See proposal.md. `Reserve` in `Table.tsx` already lays card faces at computed positions with `useTexture`; `boardSize` gives the board's world size (width 10). The camera's minimum zoom fits the board only; MapControls pans freely.

## Goals / Non-Goals

**Goals:**
- Card faces beside the board from the game state, no new content.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Positions in `geometry.ts`
`tableauPosition(board, row)` returns the centre of row `row` in a column right of the board: x = half the board width + 0.3 + 1.2 (the column is 2.4 wide); rows stack downward from the board's top edge with the sheet 2.4 by 3.0, the mystery 2.4 by 1.5, mythos cards 1.1 by 1.7 side by side. Layer: 2D geometry, pure, tested.
- Rejected: widening the camera's fit to include the column. The board would shrink on every screen for a column read only now and then; panning reaches it.

### D2. `Tableau` component
Takes `{ sheet: string; mystery?: string; mythos: string[] }` and draws each face as a `Billboard` plane, as `Reserve` does. `App.tsx` builds the prop from `ancientOne.images`, `awakened`, `currentMystery` and `ongoingMythos`. Layer: view.

## Risks / Trade-offs

- A tableau outside the fitted view goes unnoticed → the status panel still lists the same cards; a later change can hint at it.

## Open Questions

- None.
