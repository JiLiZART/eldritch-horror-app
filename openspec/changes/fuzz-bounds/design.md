## Context

See proposal.md. The invariants run after every accepted step with a `where` label; the content gives each investigator's printed health and sanity and the board its space ids.

## Goals / Non-Goals

**Goals:**
- Six assertions in the existing function, labelled like the others.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Bounds from content
For each investigator: `0 <= health <= printed.health`, `0 <= sanity <= printed.sanity`, `tickets.length <= 2`, every improvement in `{1, 2}`, `clues >= 0`, space in the board's ids; if `defeated` is `"health"` then `health === 0`, if `"sanity"` then `sanity === 0`. For each monster on the board: space in the board's ids. Layer: tests.

## Risks / Trade-offs

- A bound the engine does not keep fails the suite until its change lands → that is the point; the change is proposed in the same tick and the assertion can be marked pending meanwhile.

## Open Questions

- None.
