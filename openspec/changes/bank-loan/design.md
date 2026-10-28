## Context

See proposal.md. `acquireAssets` stores the waiting `Roll` as `ActionPhase.acquiring`; `rerollDie` recounts `successes` from the dice; `takeAssets` measures the cards against `successes`. Double-sided decks hand out their bottom card; `gainCard` does that for card text but is gated to the Encounter and Mythos phases. Debt cards are `eh01/condition/debt-N`.

## Goals / Non-Goals

**Goals:**
- The loan as one flag on the waiting roll and one action-phase function; the Debt card taken as `gainCard` would.

**Non-Goals:**
- Debt's reckoning text (see proposal).

## Decisions

### D1. `acquiring: Roll & { loan?: true }`
The dice and their successes stay the roll's; `takeAssets` uses `successes + (loan ? 2 : 0)`, so a reroll's recount cannot lose the loan. Layer: game state.
- Rejected: adding 2 to `successes`. `rerollDie` would wipe it.

### D2. `takeBankLoan(state, set)` in `actions.ts`
Requires the waiting roll; refuses "X already has Debt" when a held condition is named Debt, "the Bank Loan was already taken" when `loan` is set, "no Debt card is left" when the condition deck holds none; takes the last Debt card of the condition deck into `conditions`, sets `loan`. No log line: the Action phase keeps none; the journal gets the action as today. Layer: engine.
- Rejected: reusing `gainCard`. Its phase gate and its Encounter-phase log do not fit the Action phase.

### D3. Form
`Acquire.tsx`: "Take Bank Loan (+2 successes, gain Debt)" beside the dice, disabled once taken; the result line reads "result N (+2 Bank Loan)". Layer: view.

## Risks / Trade-offs

- A loan then a refused card choice keeps the Debt → correct, the loan is taken when chosen, not when cards are bought.

## Open Questions

- None.
