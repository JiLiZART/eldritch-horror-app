## Context

See proposal.md. `loadGame`, `parseGame` and `importAll` return or throw English sentences; `App` puts them in `game.error` beside the engine's refusals, and `translate` returns a missing key unchanged.

## Goals / Non-Goals

**Goals:**
- Keys out of `saved.ts`, one translation where the error is shown.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Notes as keys
`saved.ts` returns the note as a key (`save.unreadable`, `save.older`, `save.notBackup`); `App` translates the note with `t()` at the three places it stores one in `game.error`, so the four components that print the error change nothing and an engine sentence falls through as it is. Tests in `saved.test.ts` expect the keys. Layer: table and content.

## Risks / Trade-offs

- An engine sentence that happens to be a key name would be translated → none is.

## Open Questions

- None.
