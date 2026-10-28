## Context

`Table.tsx` renders one R3F scene under an orthographic top-down camera driven by drei `MapControls` (drag pans, wheel zooms to cursor, clamp from `tableExtent`). The tableau (`tableauPosition`), sheets (`sheetPosition`), held cards (`heldPosition`) and encounter card (`encounterPosition`) are meshes in that scene beside and below the board, so `tableExtent` grows with them. Card focus glides the camera onto a card's world position. Card and token images already come from the Tabletop Playground mod via `scripts/copy-core-assets.ts` into `public/cards/eh01` (sheets, held cards, tokens, pawns), so no new asset import is needed.

## Goals / Non-Goals

**Goals:**
- Board-only camera; screen-fixed card layers that reuse the existing card, token and hover-badge components.

**Non-Goals:**
- No game-state change. No new content fields. No change to how the reserve, tracks or pieces on the board render.

## Decisions

### D1 — Overlays are a drei `<Hud>` layer in the same canvas (view, 3D)
The tableau and the viewed investigator's cards render inside `<Hud>` with their own orthographic camera in screen pixels, so they draw over the board after it and never move with `MapControls`. The existing card meshes, sheet tokens, mystery tokens, dimming and hover badges move into the HUD unchanged except for their positions.
- *Rejected*: DOM `<img>` overlays — would re-implement health/sanity/improvement tokens on sheets, turning cards over and hover badges in HTML, duplicating the 3D versions.
- *Rejected*: a second `<Canvas>` — two WebGL contexts, textures loaded twice.
- *Consequence*: the HUD camera is sized from the canvas size on resize; reduced-motion and panel-width refits apply to it automatically through R3F's size.

### D2 — Overlay layout in screen units (view)
New pure functions in `geometry.ts` replace the four world-position helpers: `tableauLayout(viewport)` anchors the sheet at the top-left with a fixed gutter, mystery to its right, mythos row after it; `investigatorLayout(viewport, held)` centres the sheet at the bottom with held cards and the encounter card to its right, wrapping held cards when the row would pass the viewport width. Card heights are a fraction of the viewport height with a pixel minimum, so the board keeps most of the view.
- *Rejected*: sizes in world units scaled by zoom — the overlays would still grow and shrink with the map.
- *Consequence*: `tableExtent` returns the board alone; `geometry.test.ts` cases for tableau, sheet and held positions are rewritten for the layouts.

### D3 — The clamp lets the board slide out from under the overlays (view)
`MapControls` keeps clamping to the board, widened on each side by the screen footprint of the overlay on that side, divided by the current zoom (left/top by the tableau, bottom by the investigator layer). Every space can therefore be brought clear of an overlay.
- *Rejected*: hiding the overlays while dragging — loses the "cards stay in reach" goal.
- *Rejected*: insetting the camera viewport by the overlays — the bottom-middle layer covers only the middle, so a rectangular inset wastes the corners.

### D4 — The viewed investigator is view state that follows the turn (App)
`App` keeps `{ seat, whileActive }`: the chosen seat and the active seat at the time of choosing. The viewed seat is `chosen.whileActive === active ? chosen.seat : active`, so the view follows the turn without an effect. Status-table, Trade and Encounter focus set the holder as chosen before enlarging. Tabs are 2D DOM buttons over the canvas bottom edge with pawn images, keyboard reachable, in seat order.
- *Rejected*: storing the viewed seat in the game state — it is per window and not part of the game; it would also sync across windows.
- *Rejected*: a `useEffect` resetting the choice on turn change — derived state is enough.

### D5 — Card focus splits into glide and enlarge (view)
Focus becomes `{ kind: "board"; id }` (reserve cards, monster tokens: camera glide as today) or `{ kind: "overlay"; id; back }` (any HUD card: drawn enlarged in the HUD centre over a dim backdrop). Escape and a click on the backdrop clear it; a click on the card turns it when it has a back. Reduced motion makes the enlargement instant.
- *Rejected*: gliding the camera into the HUD — the HUD has no world position to glide to.

## Risks / Trade-offs

- [`MapControls` listens to DOM pointer events on the canvas, so a drag that starts on a HUD card still pans the board] → disable the controls while the pointer is over a HUD mesh (`onPointerOver`/`onPointerOut`), re-enabled on leave; covered by a browser check in tasks.
- [Small windows: the bottom layer and the tableau can cover much of the board] → minimum sizes plus D3's clamp keep every space reachable; overlay sizing is tuned in the browser.
- [Spec scenarios on gliding to held cards and sheets change] → rewritten in the delta; existing tests that assert sheet world positions are replaced, not kept beside new ones.

## Open Questions

- Exact overlay height fractions for narrow windows; tune during apply, no spec change.
