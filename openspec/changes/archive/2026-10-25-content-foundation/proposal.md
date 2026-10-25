## Why

The app has no code and no game data. Every later change (rules engine, 3D table, card play) needs the same foundation: a board graph, a rules reference with stable terms, UI icons, and a typed catalog of game content. Building it once, from the material in `inspired/`, stops each feature from re-deriving it.

## What Changes

- Author the board as data: every space on `inspired/All_boards.jpg` (core map plus embedded Egypt, Antarctica and Dreamlands spaces) with kind, region, coordinates, paths and path types, and the set that activates it.
- Write a bilingual rules glossary and phase reference from `inspired/manual_eng.pdf` (pages 1-2, 7-8), cross-checked against `inspired/EH_reference.pdf` as the authority on conflicts.
- Extract the game icons from `inspired/manual_eng.pdf` with alpha, name them by glossary term, add the dice SVG from the Tabletop Playground mod, and publish a manifest.
- Define the content schema (sets, investigators, Ancient Ones, mythos stages, card catalog, encounter decks, monsters) seeded from `inspired/ttp-eldritch-horror-master/typings/global.d.ts` and the mod's set scripts. Populate it for the core set only, with card images copied from the mod's assets.
- Add a validation step so every data file is checked before it is used.
- Non-goals: card text transcription or OCR, monster statistics, the rules engine, any rendering, expansion sets beyond core data, fan expansions in `inspired/ФАН_ДОПЫ`.

## Capabilities

### New Capabilities
- `board-graph`: spaces, paths and board texture as validated data.
- `rules-glossary`: rules terms, phases, actions, tests and combat as a cited, bilingual reference with machine-readable enumerations.
- `icon-set`: named game icons with transparency and a manifest.
- `content-schema`: typed, validated catalog of sets and their components, populated for the core set.

### Modified Capabilities
<!-- none: no existing specs -->

## Impact

- New top-level directories for data (`content/`), static files (`public/`) and one-shot extraction scripts.
- First dev dependencies: TypeScript, a test runner, a script runner. No runtime code.
- Project tooling bootstrapped (package manager config already present in `package.json`).
- Card and board images are Fantasy Flight Games artwork; this change keeps them in the repo for a non-commercial fan project and records the attribution.
