## Context

See proposal.md. `SET_FILES` in `src/content/set-files.ts` lists every set file; a missing list loads as `[]`; `validate.ts` checks each prelude entry's id and images, so an empty list validates.

## Goals / Non-Goals

**Goals:**
- One file, no code.

**Non-Goals:**
- Prelude rules (see proposal).

## Decisions

### D1. An empty list, not a loader change
The schema's "every set declares its lists" reading wins over "a missing file means none"; the loader's fallback stays for sets that genuinely lack a file. Layer: content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
