## Context

See proposal.md. The 24 main specs under `openspec/specs/` each open with a Purpose line and carry the deviations as `**Deviation**:` sentences; the panel groups are Investigator, Cards, Board, Monsters and Ancient One.

## Goals / Non-Goals

**Goals:**
- A player reads the top of the README and can run a game; a developer reads the bottom and can change it.

**Non-Goals:**
- Teaching the board game (see proposal).

## Decisions

### D1. Structure
Playing the table (run, start, the three phases, card text by hand, saves and undo, journal and glossary), What the engine models (one line per capability, from the Purpose lines), What stays with the players (the deviations, deduplicated and grouped by topic), Developing (prerequisites, scripts, content pipeline, OpenSpec, tests). Layer: docs.

### D2. Derived, not invented
Every rule claim in the README traces to a spec sentence; the deviations list is a prose rendering of the `**Deviation**:` sentences, so a later change updates both in the same commit. Layer: docs.

## Risks / Trade-offs

- The README can drift from the specs → the OpenSpec archive step is the moment to touch it; noted in the Developing section.

## Open Questions

- None.
