## 1. Assets

- [x] 1.1 Add `scripts/board-localization.ts` + `content:board-localization` script; run it and verify 34 cut-outs, the textless board, `content/board/labels.json` and `content/board/i18n/{en,ru}.json` exist and every location maps to a board space
- [x] 1.2 Add PT Serif TTF to `public/fonts/` and credit it in `content/ATTRIBUTION.md`; point `board.json` texture at the textless board and delete `all-boards.webp`; verify `pnpm test` still passes

## 2. Label helpers (test-first)

- [x] 2.1 Write failing tests for `fitScale` (fits → 1, too wide/tall → shrink ratio) and `iconGaps` (replaces `{skill}` placeholders with a gap and reports each icon position); verify they fail
- [x] 2.2 Implement both in `src/table/labels.ts`; verify the tests pass
- [x] 2.3 Write a test that every location and board slot in `labels.json` has an English and a Russian string and every location id is a board space; make it pass

## 3. Board layers

- [x] 3.1 Render labels with drei `<Text>` in the chosen language, fitted to slots with inline skill icons; verify by screenshot at full zoom in EN and RU
- [x] 3.2 Render cut-outs as groups with their labels; hover/selected scale from centre, click selects the space, disabled sets inert, reduced motion instant; verify by hovering London and clicking Tokyo in the running app
- [x] 3.3 Hand-measure and add legend, omen ribbon (curved) and Bank Loan slots; verify by screenshot against the original board

## 4. Language switch

- [x] 4.1 Add `lang` to App (localStorage, browser default) and an EN/RU radio group in the panel; verify switching during a game keeps the state and the choice survives a reload

## 5. Finish

- [x] 5.1 Run simplify/deslop, remove dead code, run `pnpm typecheck && pnpm test`
