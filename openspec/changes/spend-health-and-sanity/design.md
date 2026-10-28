## Context

See proposal.md. `change` in `effects.ts` applies a delta behind `subject`, clamps gains and defeats at 0; `changeHealth` and `changeSanity` wrap it.

## Goals / Non-Goals

**Goals:**
- One guard in front of the existing loss.

**Non-Goals:**
- Other costs (see proposal).

## Decisions

### D1. `spend(state, content, id, stat, amount)` in `effects.ts`
Behind `subject`; refuses "X cannot spend their last health" when `me[stat] - amount <= 0`; otherwise applies the loss through `change` and logs "X spends N health". `spendHealth` and `spendSanity` wrap it. Layer: engine.
- Rejected: a flag on `change`. Two call sites with different wording are clearer than one with a mode.

### D2. Two buttons
"Spend 1 health" and "Spend 1 sanity" beside the loss buttons. Layer: view.

## Risks / Trade-offs

- None beyond the ordinary.

## Open Questions

- None.
