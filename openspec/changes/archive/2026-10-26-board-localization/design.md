## Context

The table (`src/table/Table.tsx`) draws `public/board/all-boards.webp` (4096 px wide, downscaled from the 9437 × 6198 scan) on a plane 10 world units wide, with markers, paths and pieces above it. Board coordinates in `content/board/board.json` are normalized 0..1 over the scan. The asset pack in `inspired/board_localization_assets/` uses the same scan pixel space, but its own location ids (`heart_of_africa`, `city_of_elder_things`) differ from board space ids (`the-heart-of-africa`, `eh03-city-of-the-elder-things`). `inspired/` is gitignored, so the app can only read what a script copies out of it.

All decisions here touch the view layer only; game state is not changed. Everything new is drawn in the existing 3D scene.

## Goals / Non-Goals

**Goals:** board text in EN/RU drawn crisply at full zoom; cut-outs aligned to the pixel with the board underneath.

**Non-Goals:** a general UI translation layer for the panel; editing the strings in the app.

## Decisions

### D1. One asset script copies and re-keys the pack
`scripts/board-localization.ts` (one-shot, like `copy-core-assets.ts`) writes:
- `public/board/board-textless.webp`, 4096 px wide like the current texture;
- `public/board/locations/<space-id>.webp`, each sprite at half the source scale (a little sharper than the board's 0.43); alignment comes from its rectangle in board pixels, not its pixel size;
- `content/board/labels.json`: per location `{ space, x, y, w, h, image, slots }` and the board-wide slots, all in normalized board coordinates (slot rects converted from sprite-relative pixels), plus the hand-measured slots for legend, omen ribbon and Bank Loan card;
- `content/board/i18n/en.json`, `ru.json` copied verbatim, keys re-keyed from `loc.<pack-id>.*` to `loc.<space-id>.*`.

The pack-id → space-id map is an explicit table in the script; the script fails if any of the 34 ids is unmapped or maps to an unknown space.
*Alternatives:* reading the pack at runtime (rejected: `inspired/` is not served or committed); merging labels into `board.json` (rejected: board.json is the graph, validated by its own spec, and its texture coordinates would mix with art layout).

### D2. Text as SDF meshes (drei `<Text>`), not baked textures
Labels render with drei `<Text>` (troika, already installed with drei) in world units, so they stay sharp at the 10× maximum zoom and switch language without re-baking. Font: PT Serif (OFL, full Cyrillic) TTF in `public/fonts/`.
*Alternatives:* baking text into a per-language canvas texture (rejected: blurry at max zoom, ~2 large textures); HTML overlays (rejected: do not scale with the camera, hit-testing fights MapControls); default troika font (rejected: fetched from a CDN at runtime).

### D3. Fit by shrinking after layout
Each slot gives width, height and, for names, the printed line count. Text starts at `fontSize = h / lines` (rules boxes: a per-slot size in labels.json), wraps at `maxWidth = w`, and after troika's sync the label scales down uniformly if its block bounds exceed the slot. Pure helper `fitScale(bounds, slot)` is unit-tested.

### D4. Skill icons inline via reserved gaps
A `{skill}` placeholder is replaced by a fixed-width gap of spaces; after sync the caret positions of that gap place a small plane with `icons/<skill>.png` (existing icon set) in it. Splitting of a string into text and icon runs is a pure, tested helper.
*Alternative:* writing the skill name as a word (rejected: spec asks for icons, and the board prints icons).

### D5. Cut-outs are planes in a group with their labels
Each location renders as a group at its sprite centre: the sprite plane (alpha-tested) and its labels as children, so one scale on the group grows both from the centre. Scale target 1.08 when hovered or selected, eased in `useFrame`; instant with reduced motion. Hover uses the sprite's rectangle (raycast ignores alpha) — acceptable because neighbouring cut-outs do not overlap enough to matter. Layer order (z): board 0, cut-outs 0.004, labels 0.005, paths 0.01, markers 0.02, pieces 0.05, so markers keep their click priority. Cut-outs of disabled sets render (they are printed art) but get no pointer handlers.

### D6. Language is view state in App
`lang: "en" | "ru"` lives in `App`, initialised from `localStorage` (`eh.board-lang`) else `navigator.language`, written back on change in the switch's handler (no effect). Reads and writes are wrapped in try/catch. The switch is a two-option radio group in the panel, next to Sets.

## Risks / Trade-offs

- [Draft English strings may be wrong] → strings are data; corrected by re-running the script or editing the JSON.
- [Hand-measured legend/omen/loan positions drift from art] → measured once against the textless board and checked with a screenshot; the curved ribbon uses troika `curveRadius`.
- [Font weight differs from the printed board] → accepted; one serif family keeps the board consistent across both languages.
- [Larger download: textless board + 34 cut-outs] → WebP capped at the current texture scale; the old `all-boards.webp` is deleted.

## Migration Plan

Run `pnpm content:board-localization` once and commit its output; `board.json.texture` switches to the textless board. Rollback: revert the commit.
