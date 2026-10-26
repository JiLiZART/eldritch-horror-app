## Why

The table shows a scan of the English board, so every printed name, subtitle and rules box is in English only, baked into the texture, and the location art cannot react to the pointer. `inspired/board_localization_assets/` now gives a textless board with the same 9437 × 6198 pixel coordinates, 34 textless location cut-outs, the text slot layout and every removed string in English and Russian. With it the board text can be drawn by the app in either language.

## What Changes

- The board texture becomes the textless board; the printed text is drawn back on top of it from the string tables, in the slots given by the layout: location names, subtitles, Antarctica rules lines, the doom track and reserve headers and the three side-board rules boxes.
- The strings the layout does not place (legend labels, the curved Omen Track ribbon, the Bank Loan card) are drawn at hand-measured positions.
- Skill icon placeholders in the strings (`{lore}` etc.) are drawn as the skill icons already in the icon set.
- The player can switch the board language between English and Russian; the choice is remembered on this device. The default follows the browser language.
- Each of the 34 location cut-outs lies exactly over its art and grows from its centre while the pointer is over it or its space is selected; clicking it selects its space. Cut-outs of disabled sets do not react.
- Non-goals: translating the side panel, forms or card images; proofreading the draft English strings; changing the board graph or space coordinates.

## Capabilities

### New Capabilities
- `board-language`: the printed board text drawn in the chosen language, and the language choice itself.

### Modified Capabilities
- `table-view`: the location art on the board responds to the pointer and selects its space.

## Impact

- New asset step `scripts/board-localization.ts` (`pnpm content:board-localization`): converts the textless board and cut-outs to capped WebP under `public/board/`, writes `content/board/labels.json` (layout keyed by board space id) and `content/board/i18n/{en,ru}.json`.
- A bundled Cyrillic-capable font under `public/fonts/`, credited in `content/ATTRIBUTION.md`.
- `content/board/board.json` texture points to the textless board.
- `src/table/Table.tsx` gains label and cut-out layers; `App`/`Panel` gain the language switch.
- Source: `inspired/board_localization_assets/README.md`, `layout.json`, `i18n/`.
