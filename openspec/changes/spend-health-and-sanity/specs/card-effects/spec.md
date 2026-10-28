## MODIFIED Requirements

### Requirement: Health and sanity change by card text
An investigator SHALL gain or lose health or sanity by an amount; gains SHALL stop at the sheet maximum, and a loss that reaches 0 SHALL defeat the investigator at once by the defeat rule. Spending health or sanity, as a card's cost, SHALL be refused when it would reach 0, since an investigator cannot spend their last point; otherwise it is taken like a loss. **Deviation**: effects that prevent a loss are left to the players.

#### Scenario: Gain at the maximum
- **WHEN** Leo Anderson at 5 of 6 health gains 2 health
- **THEN** he has 6 health

#### Scenario: Loss defeats
- **WHEN** Lily Chen at 2 sanity loses 2 sanity at doom 12
- **THEN** she is defeated by sanity and doom is 11

#### Scenario: Spent
- **WHEN** Leo Anderson at 3 health spends 1 health
- **THEN** he has 2 health and the log says he spends it

#### Scenario: Last point kept
- **WHEN** Leo Anderson at 1 sanity spends 1 sanity
- **THEN** it is refused because an investigator cannot spend their last sanity
