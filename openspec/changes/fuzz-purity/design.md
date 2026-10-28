## Context

See proposal.md. The driver calls `chosen(s)` and either keeps `s` on a refusal or moves to the returned state; `check` already proves the returned state survives a JSON round trip.

## Goals / Non-Goals

**Goals:**
- One snapshot and one comparison per step.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Snapshot and compare
`const before = JSON.stringify(s)` before `chosen(s)`; in both the refusal branch and after `check`, `expect(JSON.stringify(s), \`${where}: input state untouched\`).toBe(before)`. A string compare costs one serialisation per step, in line with the round-trip check. Layer: tests.

## Risks / Trade-offs

- A step that mutates its input fails the suite until its change lands → proposed in the same tick, as with the combat floor.

## Open Questions

- None.
