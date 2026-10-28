## Context

See proposal.md. `content/rules/glossary.md` has `## Section` headings and `### English / Русский` entries, each a text paragraph and a `Source:` line, some marked `*(unofficial)*`. The Vite plugin serves JSON only and strips markdown from the build; Vite can import a file's text with `?raw`. The panel is a column of sections, several already foldable.

## Goals / Non-Goals

**Goals:**
- One parser with a test on the real file; one component; no server change.

**Non-Goals:**
- Links from logs, rulebook pages (see proposal).

## Decisions

### D1. `parseGlossary(markdown)` in `src/content/glossary.ts`
Returns `{ section, entries: { en, ru, unofficial, text, source }[] }[]`: a `##` line opens a section, a `###` line an entry split on " / ", the following non-empty lines up to `Source:` are the text, the `Source:` line the source. The test pins the entry count and a few names on the committed file, so a format slip fails the build's tests. Layer: content.
- Rejected: a JSON copy of the glossary. Two files to keep in step.

### D2. Raw import
`import glossary from "../../content/rules/glossary.md?raw"` in `Glossary.tsx`; parsed once at module load. Layer: view.
- Rejected: serving the markdown from the content plugin. A server change and a fetch for a file that never changes at runtime.

### D3. `Glossary.tsx`
A `<details>` with the summary "Rules glossary", a filter input, and the sections as headings with definition lists; the filter lowercases both sides and keeps entries whose names or text include the words. Mounted below the journal in `Panel.tsx`, shown with or without a game. Layer: view.

## Risks / Trade-offs

- The raw import adds the glossary text to the bundle → a few dozen kilobytes.

## Open Questions

- None.
