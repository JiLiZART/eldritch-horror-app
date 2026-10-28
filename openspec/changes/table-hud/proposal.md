## Why

The Ancient One sheet, mystery and mythos cards lie right of the board and every investigator sheet with its held cards lies below it, all on the same 3D table. Reading the board and the cards at once is impossible: zooming onto a city pushes the sheets off screen, and fitting the table shrinks the board to fit card rows around it. The rulebook keeps the Ancient One sheet and mystery "near the game board" and each investigator's sheet and possessions in front of their player (`inspired/eh01_rulebook.pdf` p.4–5 "Setup" steps 3–5 and 9H, setup diagram p.5); on one screen that means cards stay in reach while the map moves.

## What Changes

- The board becomes a map viewport: drag pans, the wheel and pinch zoom under the pointer, the arrow and plus/minus keys keep working. The table is the board alone, also during a game, so zooming out fills the view with the board.
- The Ancient One's cards move to a fixed overlay at the top-left of the viewport: the sheet (back once awakened) with its mystery tokens on the mystery card, and the ongoing and drawn mythos cards. They stay put while the map pans and zooms.
- The active investigator's cards move to a fixed overlay at the bottom-middle: the sheet with its health, sanity, improvement and ticket tokens, the held possessions and conditions, and the encounter card being resolved. A row of investigator tabs (pawn portraits, seat order, lead marked, defeated dimmed) shows another investigator's cards on demand; the overlay follows the active investigator when the turn passes.
- Bringing up a card in an overlay enlarges it over the viewport instead of gliding the camera; a further click turns a card with a back, Escape or a click outside closes it. Reserve cards and monster tokens stay on the board and keep the camera glide.
- The board can be panned so any space clears an overlay that covers it.
- Card and token faces keep coming from the Tabletop Playground mod's core images (`inspired/ttp-eldritch-horror-master/assets/01 Core`), already copied to `public/cards/eh01` by `scripts/copy-core-assets.ts`; the investigator tabs use the pawn images from the same source.
- **Deviations**: none.
- Non-goals: collapsing or resizing the overlays; moving the reserve off the board; showing several investigators' sheets at once; touch-specific gestures beyond pinch; new card art.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the table is the board alone; the Ancient One's tableau and the investigator sheets with held cards move into fixed overlays over the viewport; cards in the overlays are read by enlarging them in place.

## Impact

- `src/table/Table.tsx`: tableau, sheets, held and encounter cards leave the board scene for screen-fixed overlay layers; `MapControls` clamp uses the board only.
- `src/table/geometry.ts`: `tableExtent` shrinks to the board; overlay layout replaces `tableauPosition`, `sheetPosition`, `heldPosition`, `encounterPosition`.
- `src/table/App.tsx`: viewed investigator (follows the active one, switched by tab) as view state; card focus splits into camera glide (board) and enlarge (overlay).
- `content/panel/i18n`: tab and close labels. 3D for the board and the overlay card layer; 2D only for tab buttons.
