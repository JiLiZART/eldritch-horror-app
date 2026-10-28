## Context

See proposal.md. `Effects.tsx` renders one `<fieldset>` with a row per family of effects and a list of held cards; `Encounter.tsx` and `Mythos.tsx` mount it. `table.css` styles `.panel fieldset`.

## Goals / Non-Goals

**Goals:**
- Same controls, same handlers; only the grouping and folding change.

**Non-Goals:**
- Persisting the fold state, shortcuts (see proposal).

## Decisions

### D1. Native `<details>` per group
Five `<details>` elements inside the fieldset, each with a `<summary>`: Investigator (open), Cards, Board, Monsters, Ancient One. The browser handles folding; no React state, no storage. Layer: view.
- Rejected: tabs. A card often needs two groups at once (lose sanity and spawn a monster); folding lets both stay open.
- Rejected: fold state in React with persistence. Nobody asked, and `<details open>` already gives a sensible default.

### D2. The investigator select stays above the groups
It applies to the Investigator and Cards groups and to Spawn gate's logging; keeping it at the top avoids repeating it. Layer: view.

### D3. Styling
`table.css`: `.effects summary` as a bold line with a pointer cursor; groups keep the fieldset's spacing. Layer: view.

## Risks / Trade-offs

- The browser checks in earlier changes click buttons inside folded groups → Playwright clicks through `<details>` only when open; the check scripts in the scratchpad open the group first. Not part of the repository.

## Open Questions

- None.
