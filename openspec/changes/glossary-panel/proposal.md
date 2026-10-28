## Why

The panel keeps saying "the card text is left to the players", and the players then need the rule words: what Delayed does, what counts as nearest, how a reckoning resolves. Those words exist, bilingual and sourced, in `content/rules/glossary.md`, the file every spec and engine comment cites, yet nothing shows it at the table. No rulebook source: the digital table's own convenience.

## What Changes

- A Rules section beside the board, folded by default, listing every glossary entry under its section with the English and Russian names, the text and the sources, and a filter box that narrows by name or text in either language.
- The glossary is the committed markdown, read at build time, so the panel and the citations never drift.
- **Deviations**: none; the markdown's skill symbols are shown as printed.
- Non-goals: editing the glossary in the app, links from log lines to entries, the full rulebooks.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the rules glossary is shown beside the board.

## Impact

- New `src/content/glossary.ts` (the markdown parser, tested on the committed file) and `src/table/Glossary.tsx` (the section with the filter), mounted from `Panel.tsx`; the markdown imported raw by Vite. 2D panel only.
- `content/rules/glossary.md`: unchanged; its format becomes a contract the parser's test pins.
