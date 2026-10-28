## Context

See proposal.md. The state holds `assetDiscard`, `artifactDiscard` and the other card discards as id lists; `Status` already names decks through `deck.*` strings and cards through `cardName`.

## Goals / Non-Goals

**Goals:**
- One fold, reuse the deck names.

**Non-Goals:**
- See proposal.

## Decisions

### D1. The fold
A `<details>` with `status.discards` as its summary, listing each non-empty card discard as the deck's name and the card names joined with commas. Layer: panel and content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
