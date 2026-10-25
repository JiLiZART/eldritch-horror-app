## Why

The engine can build a start-of-game state (`game-setup`), but the table still draws all twelve investigators from content and nothing else. Nobody can see a setup, so data mistakes (gate tokens, clue spaces, monster relocation, starting possessions) stay invisible until a rules phase is written. Showing the state now gives every later change a table to put its pieces on and lets setup be checked by eye against `inspired/manual_eng.pdf` p.3.

## What Changes

- A new-game form: choose the Ancient One, the investigators in seat order, the mythos difficulty and a seed, then start. Setup errors from the engine are shown instead of a silent failure. A started game can be abandoned to start another.
- The table renders the game state instead of content: pawns of the chosen investigators on their current spaces, gate tokens on cities, facedown clue tokens, monster tokens, the active expedition token. Before a game starts the board is empty.
- The panel shows the game: doom, omen with eldritch tokens, reference card values, the current mystery card, the reserve cards, deck sizes; each investigator's space, health, sanity, clues and possessions; the pieces on the selected space.
- The client loads the whole core set, not only investigators.
- The `board-graph` spec scenario claiming numbered spaces are only sea or wilderness is corrected: spaces 1, 5, 6, 7, 14, 15, 16, 17 and 20 are printed as cities and the data already says so. No data change.
- Non-goals: no actions, no phases, no doom or omen tracks drawn on the board (coordinates are not in the board data), no save/load, no URL state, no expansions in the game state (set toggles stay a view option).

## Capabilities

### New Capabilities
- `new-game`: choosing an Ancient One, investigators, difficulty and seed, starting a game and seeing why a choice is refused.

### Modified Capabilities
- `table-view`: pieces on the board come from the game state (replaces "Starting pawns stand on their spaces"); the selected space lists its pieces; the panel shows game and investigator status.
- `board-graph`: numbered spaces may be cities; scenario text corrected to match the printed board.

## Impact

- `src/content/client.ts` fetches every set file; a shared file list moves out of `src/content/load.ts` so browser and Node use the same one.
- `src/table/` gains a new-game form, a pieces helper with tests, piece rendering in the scene, status sections in the panel. The gate token for Buenos Aires is renamed from the source typo `buenos-aries` so token files follow space ids.
- Card copies drop the source copy number from their name (`Mists of Releh`, not `Mists of Releh 2`) in `cards.json` and the copy script; the dev server answers 404 for a missing set list.
- No new dependencies. Engine untouched.
