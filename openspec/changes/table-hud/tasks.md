## 1. Layout and clamp geometry

- [ ] 1.1 Rewrite `geometry.test.ts` cases: `tableExtent` is the board alone with or without a game; `tableauLayout` puts the sheet at the top-left gutter, the mystery to its right, mythos cards after it; `investigatorLayout` centres the sheet at the bottom, held cards and the encounter card to its right, a wrapped row when the viewport is narrow (`pnpm test geometry` fails)
- [ ] 1.2 Implement `tableauLayout` and `investigatorLayout`, shrink `tableExtent`, remove `tableauPosition`, `sheetPosition`, `heldPosition`, `encounterPosition` (1.1 passes)
- [ ] 1.3 Add a failing test for the clamp margins: the board may slide past each edge by the overlay footprint on that side divided by the zoom
- [ ] 1.4 Implement the clamp margins and use them in `Table.tsx`'s `MapControls` clamp (1.3 passes)

## 2. Viewed investigator

- [ ] 2.1 Add a failing test for the viewed-seat rule: the chosen seat holds while the same seat is active; a new active seat is viewed after the turn passes
- [ ] 2.2 Implement the viewed-seat helper and the `{ seat, whileActive }` view state in `App.tsx`; Status-table, Trade and Encounter focus set the holder first (2.1 passes)

## 3. Overlay layers

- [ ] 3.1 Move the tableau (sheet, mystery with its tokens, mythos row) into a `<Hud>` layer at the top-left (verify in the browser with agent-browser: dragging and zooming the board leaves the sheet in place and size; awakened shows the back)
- [ ] 3.2 Move the viewed investigator's sheet with its tokens, held cards and encounter card into the HUD at the bottom-middle, dimmed when defeated (verify in the browser: Leo Anderson's sheet and Hired Muscle at bottom-middle at set-up)
- [ ] 3.3 Add the investigator tabs as keyboard-reachable buttons with pawn images, lead and viewed marked, defeated dimmed, labels in `content/panel/i18n/en.json` and `ru.json` (`pnpm test lang` passes; in the browser choosing Lily Chen's tab views her, and the next turn views the active investigator)
- [ ] 3.4 Disable `MapControls` while the pointer is over a HUD card (verify in the browser: a drag starting on the sheet does not pan the board; a drag on the board still does)

## 4. Reading cards

- [ ] 4.1 Add a failing test for the focus split: overlay card ids give an enlarge focus, reserve cards and monster tokens a board glide
- [ ] 4.2 Implement enlarge-in-HUD with backdrop, turn-over on click, Escape and backdrop close, instant under reduced motion; panel thumbnails, Status table, Acquire and Trade forms route through the split (4.1 passes; in the browser the mystery enlarges without moving the board, Escape restores it, a reserve card still glides)

## 5. Finish

- [ ] 5.1 Run simplify and deslop on the changed files, delete the old world-position card code and its tests, and run `pnpm test` and `pnpm build` green
