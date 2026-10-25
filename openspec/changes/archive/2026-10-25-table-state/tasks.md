## 1. Content loading and token convention

- [x] 1.1 Move the set file map into `src/content/set-files.ts`, use it from `loadSet`, add `fetchSet` to `src/content/client.ts` so `content` resolves `{ board, set }` (design D4). Verify: `pnpm test` and `pnpm build` pass; the dev page still renders the board.
- [x] 1.2 Add `"Buenos Aries": "Buenos Aires"` to the copy script typo map and `git mv public/cards/eh01/tokens/gates/buenos-aries.webp public/cards/eh01/tokens/gates/buenos-aires.webp` (design D3). Verify: every core city id has `public/cards/eh01/tokens/gates/<id>.webp`.

## 2. Pieces helper

- [x] 2.1 Write `src/table/pieces.test.ts`: a seeded Cthulhu setup with four investigators groups one gate, its monster, two clues, the expedition token and four pawns by space in the order gate, expedition, clue, monsters, pawns, with the right image paths and labels; no state gives an empty map. Verify: fails to compile.
- [x] 2.2 Implement `piecesOnSpace` in `src/table/pieces.ts` (design D2). Verify: 2.1 passes.

## 3. New-game form and game state

- [x] 3.1 Add `NewGame` in `src/table/NewGame.tsx` (design D6) and hold `GameState | undefined` plus the last error in `App` (design D1); pass `state` and `set` to `Table` and `Panel`. Verify: in the browser, starting with Cthulhu, Leo Anderson then Lily Chen shows no error and the panel lists Leo Anderson as lead; starting with no investigator shows the engine's message; abandoning returns to the form with choices kept.

## 4. Pieces on the board

- [x] 4.1 Replace `Pawns` with `Pieces` in `Table.tsx`: one billboard per piece from `piecesOnSpace`, spread per space, textures loaded per unique image (design D2, D3). Verify: Playwright screenshot after starting with four investigators shows one gate token with a monster beside it on a named city, two clue backs, the expedition token on a wilderness space, four pawns, nothing else; with no game the board shows only markers and paths.

## 5. Status in the panel

- [x] 5.1 Add game status to `Panel.tsx`: doom, omen with eldritch count, reference card, mystery image, reserve images, deck sizes; investigator rows with lead marker, space name, health, sanity, clues, possession names; pieces on the selected space (design D5). Verify: Azathoth with Akachi Onyele shows doom 15, omen green with 1 eldritch token, gates 1 clues 1 surge 1, one mystery, four reserve cards, Akachi as lead on space 15 with 5/7/1 and Mists of Releh; selecting the gate's city lists gate, monster and any investigator there.

## 6. Spec correction

- [x] 6.1 Confirm `src/content/board.test.ts` matches the corrected `board-graph` scenario (space 15 city, space 2 sea); add the assertion if missing. Verify: `pnpm test` passes.

## 7. Finish

- [x] 7.1 Run simplify/deslop over `src/table/` and `src/content/client.ts`; remove dead code (old pawn rendering, unused props). Verify: `pnpm exec tsc --noEmit --noUnusedLocals --noUnusedParameters`, `pnpm test`, `pnpm build`, `pnpm content:validate` pass; a final Playwright pass covers the scenarios in `specs/new-game` and `specs/table-view`.
