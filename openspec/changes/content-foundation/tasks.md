## 1. Tooling

- [x] 1.1 Add TypeScript, vitest and tsx as dev dependencies with `package.json` scripts `test`, `typecheck`, `content:validate`; verify `pnpm typecheck` and `pnpm test` run on an empty project
- [x] 1.2 Add `content/ATTRIBUTION.md` naming Fantasy Flight Games as rights holder and the non-commercial fan scope; verify file present and named in README
- [x] 1.3 Add README section listing dev prerequisites `pdfimages` (poppler) and `magick` (ImageMagick) with versions; verify both commands resolve locally

## 2. Content schema and validation

- [x] 2.1 Write failing vitest tests for `validate` covering: duplicate id, missing image, unknown path endpoint, disconnected core graph, icon manifest mismatch; verify tests fail for lack of implementation
- [x] 2.2 Write `src/content/types.ts` with Set, Investigator, AncientOne, Card, Monster, EncounterDeck, MythosCard, Prelude, Board, Space, Path, IconManifest types; verify `pnpm typecheck` passes
- [x] 2.3 Implement `src/content/validate.ts` and the `content:validate` script so the tests from 2.1 pass; verify `pnpm test` green and `pnpm content:validate` exits non-zero on a deliberately broken fixture

## 3. Board graph

- [x] 3.1 Write failing tests: London is a core Europe city, Lake Camp is eh03 wilderness, spaces 1-21 exist, San Francisco to Arkham is train, core graph connected from Arkham, no active path to Dreamlands when eh07 disabled, distance between adjacent spaces is 1; verify they fail
- [x] 3.2 Author `content/board/board.json`: all spaces on `inspired/All_boards.jpg` with id, EN/RU names, kind, region, set, normalized coordinates, and all paths with type; verify 3.1 tests pass and `content:validate` is green
- [x] 3.3 Add a script that draws space markers and ids over a downscaled board and writes it to the scratch directory; verify by inspecting the image that every marker sits on its space
- [x] 3.4 Produce `public/board/all-boards.jpg` at 4096 px wide from the source; verify aspect ratio equals 9437:6198 within rounding and file is under 3 MB

## 4. Rules glossary

- [x] 4.1 Write failing tests: phase enumeration order, core action list with Focus and Gather Resources gated, skill list of five, combat steps order; verify they fail
- [x] 4.2 Write `content/rules/enums.json` so 4.1 passes; verify `pnpm test` green
- [x] 4.3 Write `content/rules/glossary.md` with EN/RU names, definition and page citation for every term used in enums.json plus: delayed, defeated, devoured, doom, omen, reckoning, rumor, eldritch token, mystery, research, expedition, clue, gate, monster, epic monster, reserve, possession, improvement, nearest, distance; verify each entry has a citation and conflicts note the reference-guide reading
- [x] 4.4 Write `content/rules/round.md` with the full round sequence, test rules, combat, health and sanity from `manual_eng.pdf` pages 1-2, cross-checked against `EH_reference.pdf`; verify every section cites a page

## 5. Icon set

- [x] 5.1 Write failing tests: manifest and directory match, clue icon has transparent corners, unknown name fails, dice entry is an SVG; verify they fail
- [x] 5.2 Write `scripts/extract-icons.ts` that runs `pdfimages -png` on `manual_eng.pdf`, composes image and mask pairs with `magick`, and writes `public/icons/<term>.png`; verify a contact sheet shows every icon with correct alpha
- [x] 5.3 Name the icons by glossary term, copy the dice SVG from the mod assets, write `content/icons/manifest.json`; verify 5.1 tests pass

## 6. Core set data

- [x] 6.1 Write failing tests: core set has 12 investigators, 4 Ancient Ones, six encounter decks; Akachi Onyele sheet values; each Ancient One has three stages with three color counts; verify they fail
- [x] 6.2 Write `scripts/copy-core-assets.ts` that copies `inspired/ttp-eldritch-horror-master/assets/01 Core` into `public/cards/eh01/<deck>/` using D2 ids and prints a name-to-id table; verify counts per deck match the source directory
- [x] 6.3 Write `content/sets/eh01/investigators.json` from the mod's `investigators.js` plus skill values typed from the sheet images; verify 6.1 investigator tests pass and a sample of three is cross-checked against the Russian scans
- [x] 6.4 Write `content/sets/eh01/ancient-ones.json`, `cards.json`, `monsters.json`, `encounters.json`, `mythos.json` from the mod's set script and file names; verify 6.1 passes and `content:validate` is green with every image present

## 7. Finish

- [x] 7.1 Run simplify and deslop over `src/content` and `scripts`, remove dead code and unused helpers; verify `pnpm typecheck`, `pnpm test` and `pnpm content:validate` all green
