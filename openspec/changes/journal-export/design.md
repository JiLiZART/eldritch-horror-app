## Context

See proposal.md. `Journal` has the phrased lines by round; `navigator.clipboard.writeText` writes text on a user gesture.

## Goals / Non-Goals

**Goals:**
- One button, one string built from what is shown.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Build and copy
The text joins, per round, `panel.round` then its lines; the button calls `navigator.clipboard.writeText` and shows `panel.copied` as its label for two seconds; a clipboard refusal leaves the label as is. The filter does not apply: the whole journal is copied. Layer: panel.

## Risks / Trade-offs

- The clipboard needs a secure context → localhost and https qualify.

## Open Questions

- None.
