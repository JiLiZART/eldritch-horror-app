## Context

See proposal.md. `App` builds the corner's first line from the round, phase and active name; the `track.doom` and `track.omen` strings already exist for the hover badges.

## Goals / Non-Goals

**Goals:**
- Reuse the two strings.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Two more parts
The line's parts gain `t("track.doom", …)` and `t("track.omen", …)` after the active name, joined with the same separator; the outcome line is unchanged. Layer: view.

## Risks / Trade-offs

- A longer line → it wraps within its badge at narrow widths.

## Open Questions

- None.
