## Context

See proposal.md. `continueFight` writes `me.sanity - lost` and `me.health - lost` and calls `defeat` when the result is at or below zero; `defeat` copies the investigator as is.

## Goals / Non-Goals

**Goals:**
- Two `Math.max(0, …)`; the defeat check unchanged.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Floor in the fight
Both writes become `Math.max(0, value - lost)`; the defeat condition keeps using the unfloored difference. Layer: engine.
- Rejected: flooring in `defeat`. Other callers already pass zero; the fight is the one writer that does not.

## Risks / Trade-offs

- None.

## Open Questions

- None.
