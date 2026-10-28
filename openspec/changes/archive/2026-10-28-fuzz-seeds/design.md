## Context

See proposal.md. The seed list is a literal array in `describe`; vitest exposes `process.env`.

## Goals / Non-Goals

**Goals:**
- One env var, one script, no other change to the fuzz run.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Seeds from the environment
`const SEEDS = Number(process.env.FUZZ_SEEDS) || 6;` and `Array.from({ length: SEEDS }, (_, i) => i + 1)` replace the literal. `test:fuzz` is `FUZZ_SEEDS=60 vitest run src/engine/fuzz.test.ts`. Layer: tests.
- Rejected: a vitest config option. An env var works from any shell with no config plumbing.

## Risks / Trade-offs

- A failing high seed is reproduced by running with that seed count again → seeds are deterministic, so the same n fails the same way.

## Open Questions

- None.
