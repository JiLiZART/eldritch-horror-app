## MODIFIED Requirements

### Requirement: Clues are gained and spent
Gaining 1 clue SHALL take the clue token on the investigator's space when one lies there, else the top token of the clue pool, the clue discard reshuffled in first when the pool is empty; with no token anywhere the gain SHALL be refused. Spending 1 clue SHALL be refused when the investigator holds none; a spent clue token SHALL join the clue discard, from where an empty pool is rebuilt.

#### Scenario: Token on the space
- **WHEN** Lily Chen on Shanghai with a clue token there gains 1 clue
- **THEN** she holds 1 more clue and no clue token lies on Shanghai

#### Scenario: From the pool
- **WHEN** Leo Anderson on a space without a clue token gains 1 clue with 20 tokens in the pool
- **THEN** he holds 1 more clue and 19 tokens remain in the pool

#### Scenario: No clue anywhere
- **WHEN** an investigator gains 1 clue with an empty pool and discard and no token on the space
- **THEN** the gain is refused because no clue can be gained

#### Scenario: Spend without clues
- **WHEN** an investigator holding 0 clues spends 1 clue
- **THEN** it is refused because the investigator holds no clue

#### Scenario: Spent clue discarded
- **WHEN** Leo Anderson spends a clue
- **THEN** one clue token lies on the clue discard and the pool is unchanged
