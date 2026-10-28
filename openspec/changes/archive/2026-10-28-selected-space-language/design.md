## Context

See proposal.md. `Panel` already calls `useT()` for its headings; the Selected space `<dl>` uses literal `<dt>` text, a literal "none" twice and a literal prompt paragraph.

## Goals / Non-Goals

**Goals:**
- Nine strings, one component.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Keys
`space.id`, `space.name`, `space.kind`, `space.region`, `space.set`, `space.pieces`, `space.neighbours`, `space.none`, `space.pick` ("Click a marker or pick a space below."). Russian from the glossary's wording for space and region; plain Russian for the rest. Layer: panel and content.

## Risks / Trade-offs

- The browser checks in the scratchpad match "Selected space" and "Pieces" in English → they keep passing in English; a Russian run needs the Russian words.

## Open Questions

- None.
