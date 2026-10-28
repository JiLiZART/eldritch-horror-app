## Why

Acquire Assets carries the last deviation in the Action phase: the Bank Loan printed on the board, 2 successes for a Debt condition, is left to the players (`inspired/manual_eng.pdf` p.3 "Acquire Assets"; `inspired/EH_reference.pdf` p.2 "Банковская ссуда", p.9). With rerolls and conditions modelled, the loan is a few lines on top of the waiting roll.

## What Changes

- Bank Loan: while the Influence roll waits, the investigator may take the loan once: the result counts 2 more successes and a Debt condition is gained at once from the condition deck; refused when they already hold Debt, when the loan was already taken on this roll, or when no Debt card is left. The extra successes are kept apart from the dice, so a reroll after the loan keeps them.
- The Acquire form offers Take Bank Loan beside the dice and shows the loan in the result.
- **Deviations**: none; the Debt card's own text stays with the players.
- Non-goals: the Debt card's reckoning, other board-printed assets.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `action-phase`: Acquire Assets takes the Bank Loan.

## Impact

- `src/engine/actions.ts`: `takeBankLoan`, `takeAssets` counts the loan; `ActionPhase.acquiring` carries `loan`; `src/table/Acquire.tsx`: the button and the result line. 2D panel only.
- `content/rules/glossary.md`: Acquire Assets names the loan; no new terms.
