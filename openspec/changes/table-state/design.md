## Context

See proposal.md. `src/table/App.tsx` holds view state (enabled sets, selected space) and passes content straight to `Table` and `Panel`; `Table.tsx` draws pawns from `Investigator.startingSpace`. `src/content/client.ts` fetches only the board and the investigators. The engine exposes `setupGame({ board, set }, options)` and throws `Error` on bad options. Token images sit under `public/cards/eh01/tokens/` by convention, not catalogued in content: gates by city name, clues by space, single images for the expedition, omen, doom and eldritch tokens.

## Goals / Non-Goals

**Goals:**
- One `GameState` object in React state is the only source for pieces and status. View state stays separate (enabled sets, selection, form inputs).
- The scene draws pieces generically from a grouped list so later phases add nothing to the scene when pieces move.

**Non-Goals:**
- Drawing the doom and omen tracks on the board. Their coordinates are not in `board.json`; adding them is a `board-graph` change.
- Any mutation of the game state beyond start and abandon.

## Decisions

### D1. Game state lives in `App` as `useState<GameState | undefined>`
`undefined` means no game. `start(options)` calls `setupGame` inside `try` and keeps the error message in form state. Layer: view holds game state; the engine owns its shape.
- Rejected: a store library. Two values and two transitions; a store adds a dependency for nothing.
- Consequence: `Table` and `Panel` take `state?: GameState`; both render the empty case.

### D2. Pieces are grouped by a pure helper before rendering
`piecesOnSpace(state, set): Map<spaceId, Piece[]>` with `Piece = { kind: "gate" | "clue" | "expedition" | "monster" | "pawn"; id; image; label }`. Order inside a space: gate, expedition, clue, monsters, pawns. Tested in `src/table/pieces.test.ts`. Layer: view model derived from game state.
- Rejected: separate `<Gates>`, `<Clues>`, `<Monsters>`, `<Pawns>` components each walking the state. Four loops, four overlap rules.
- Consequence: one `<Pieces>` component spreads each space's list with `spreadOnCircle`; the first piece sits at the centre when alone. Rendering is 3D on the board plane, billboarded like pawns today.

### D3. Token images follow space ids
Gate token image: `cards/eh01/tokens/gates/<spaceId>.webp`; clue: `tokens/clues/clues-back.webp`; expedition: `tokens/active-expedition-token.webp`; monsters: `Monster.images.front`; pawns: `Investigator.pawn`. The source typo `Buenos Aries` is added to the copy script's typo map and the existing file renamed so the convention holds. Layer: content convention.
- Rejected: cataloguing tokens in content now. One set, nine gate tokens; catalogue when an expansion adds tokens (`shortcut: gate tokens by space id convention, catalogue in content when a second set adds tokens`).

### D4. Client fetches the whole set through a shared file list
`src/content/set-files.ts` exports the `{ key: file }` map used by `loadSet` (Node) and by a new `fetchSet(id)` (browser). `client.ts` resolves `{ board, set }`, the engine's `Content`. Layer: content loading.
- Rejected: importing `load.ts` in the browser; it uses `node:fs`.

### D5. Status is 2D in the panel, pieces are 3D on the board
Doom, omen, eldritch, reference card, mystery and reserve card images, deck sizes and investigator rows are DOM in `Panel`. Pieces are meshes in `Table`. Layer: view.
- Rejected: HTML overlays on the canvas (`drei` `Html`) for status. Text in DOM is accessible and selectable; nothing in status has a board position.

### D6. The new-game form is a panel section
`NewGame` component: Ancient One `<select>`, investigator checkboxes whose check order is seat order (kept in a `string[]`), difficulty radios, seed `<input type="number">` seeded from `Math.random` once, a Start button, and the engine's error text in an `aria-live` region. When a game runs the section collapses to an "Abandon game" button; the form keeps its inputs. Layer: view.
- Rejected: a modal or separate route. No router; the panel already holds controls.

### D7. Set toggles stay view-only
Enabling Dreamlands still only adds markers and paths; game state is core-only. Layer: view.

## Risks / Trade-offs

- Pieces are billboards without depth sorting; many pieces on one space may draw over each other. Mitigation: spread radius grows with the count.
- Loading all set JSON on page load adds about 150 KB. Acceptable; no lazy loading until it hurts.
- Checkbox order as seat order is implicit. Mitigation: the form lists the chosen seats in order under the checkboxes.

## Open Questions

- None.
