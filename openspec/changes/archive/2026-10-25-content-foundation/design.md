## Context

See proposal.md - Why. Inputs are read-only files under `inspired/` (gitignored): a composite Russian board image, a third-party English rules summary, the official Russian reference guide, and a Tabletop Playground mod with one image per card and setup scripts but no card text, no monster stats and an empty board graph. The repo has `package.json` with pnpm configured and nothing else. Tech stack is fixed: TypeScript, React, React Three Fiber, Three.js. This change produces data and static files only; no React code.

## Goals / Non-Goals

**Goals:**
- Committed, validated data is the source of truth. Extraction scripts are one-shot helpers and may rely on local tools.
- Ids are stable and human-readable so later specs can cite them.
- Game state vs view state: everything here is static content, consumed by the future engine layer; nothing here holds runtime state or presentation state.

**Non-Goals:**
- A generic content pipeline for all nine sets. Only core data is populated; the schema must admit the others.
- Rendering choices for the board. The texture is prepared, the 3D or 2D decision belongs to the table change.

## Decisions

### D1: Data lives in `content/` as JSON, types in `src/content/`
JSON files per concern (`content/board/board.json`, `content/sets/eh01/*.json`, `content/icons/manifest.json`, `content/rules/*.md` plus `content/rules/enums.json`). TypeScript types in `src/content/types.ts` describe them; a validation script in `src/content/validate.ts` checks data against the types and the cross-file invariants (image exists, path endpoints exist, connectivity).
- Alternative: TypeScript modules exporting objects. Rejected: data would need a build step to be read by scripts or other tools, and diffs are noisier.
- Alternative: a schema library (zod, JSON Schema). Rejected for now: plain TS type guards plus asserts cover the invariants; adding a dependency for a few checks is not justified. Revisit if the schema grows past the core set.

### D2: Ids
- Spaces: kebab-case English name (`london`, `the-amazon`), numbered spaces `space-1`..`space-21`, side-board spaces prefixed by set (`eh03-lake-camp`, `eh05-cairo`, `eh07-ulthar`).
- Sets: `eh01`..`eh09`, the numbering the mod already uses.
- Cards and components: `<set>/<deck>/<kebab-name>`, derived from the mod's file names, with a numeric suffix for duplicates (`eh01/condition/amnesia-1`).
- Alternative: the mod's GUIDs. Rejected: opaque and tied to the mod.

### D3: Board graph is hand-authored, coordinates measured on the source image
Spaces and paths are typed by hand from `inspired/All_boards.jpg` into `board.json`; coordinates are measured in source pixels and stored normalized (0..1). The file records the source size (9437x6198). A test renders markers over a downscaled copy for eyeball verification; connectivity and endpoint checks are automated.
- Alternative: detect markers by image processing. Rejected: 50-odd spaces are faster and safer to type than to detect.
- The composite board embeds Egypt, Antarctica and Dreamlands spaces. Each space carries `set`; the engine filters by enabled sets. Local paths (green dotted) are typed `local` and only active when a set that uses them is enabled.

### D4: Board texture
`inspired/All_boards.jpg` is downscaled to a web texture (4096 px wide, JPEG) and stored in `public/board/all-boards.jpg`. Labels are Russian in the pixels; English labels come from `board.json` and will be drawn by the table later. A second English texture is possible later without changing the data.

### D5: Rules glossary format
`content/rules/glossary.md` holds one entry per term: EN name, RU name, definition, source citation. `content/rules/round.md` holds the phase, action, encounter and mythos sequences. `content/rules/enums.json` holds the enumerations (phases, actions with set gating, skills, encounter kinds, mythos effects) for code. The summary (`manual_eng.pdf`) is used for structure; `EH_reference.pdf` is authoritative on wording conflicts and the entry notes the difference. These rules files are also the project glossary that later artifacts reference.

### D6: Icon extraction
`pdfimages -png` on `manual_eng.pdf` yields icon images and their soft masks as separate files; a script composes each pair into an RGBA PNG with ImageMagick and writes it under `public/icons/<term>.png`. Pairing is by extraction order and page; the result is inspected once, then committed. The manifest (`content/icons/manifest.json`) records file, size, source page. The dice SVG is copied from the mod's assets. Poppler and ImageMagick are dev prerequisites documented in the README, not npm dependencies.

### D7: Core set population
Investigator stats come from the mod's `01 Core/investigators.js` (health, sanity, starting items, starting space) plus skill values read from the investigator sheet images and typed by hand. Ancient One doom and mythos stage counts come from the mod's set scripts. Card catalogs come from the mod's asset file names. Monster entries carry name and image only. Images are copied from `inspired/ttp-eldritch-horror-master/assets/01 Core` into `public/cards/eh01/<deck>/` with the ids from D2.

### D8: Tooling
pnpm, TypeScript, vitest for tests, tsx to run scripts. Scripts live in `scripts/` and are invoked through `package.json` scripts (`content:validate`, `content:extract-icons`, `content:copy-core`). No bundler yet; it arrives with the first React change.

## Risks / Trade-offs

- Copyrighted artwork is committed. Mitigation: attribution notice, non-commercial scope, no public hosting decision in this change.
- Hand-typed skill values and coordinates can be wrong. Mitigation: coordinate overlay test, and investigator values cross-checked against the Russian sheet scans in `inspired/0. Eldritch Horror.pdf` for a sample.
- `manual_eng.pdf` is a fan summary. Mitigation: D5 makes `EH_reference.pdf` authoritative.
- Icon pairing by extraction order may mismatch masks. Mitigation: visual check of the contact sheet before commit.
- Repo size grows by roughly 710 core images (257 MB at source resolution). Mitigation: copy at source resolution for now; downscaling is a later decision when the table change knows its needs.

## Open Questions

- None blocking. English board labels and public hosting are deferred to the table change.
