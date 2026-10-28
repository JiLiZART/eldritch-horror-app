## Context

See proposal.md. `Status` in `Panel.tsx` renders one row per investigator with an Improvements column; sheets carry `skills` and `images.front`; `skill.*` keys exist in both string files; the held-card viewer keeps one open card in local state.

## Goals / Non-Goals

**Goals:**
- One column replaced, one toggle per row, two keys.

**Non-Goals:**
- Sheet backs, editing (see proposal).

## Decisions

### D1. Skills column replaces Improvements
Each cell lists "Lore 3, Influence 2, …" from `sheet.skills[k] + (i.improvements[k] ?? 0)`, the names through `skill.*`. Layer: view.
- Rejected: a separate improvements column kept. The sum is what the dice use; the glossary's Skill entry defines the value that way.

### D2. One open sheet
`Status` keeps `sheet: string | undefined`; a Show/Hide control in the name cell; the image rendered in a row below the investigator's row when open. Layer: view.

## Risks / Trade-offs

- A sheet image is wide → shown at the held-card width.

## Open Questions

- None.
