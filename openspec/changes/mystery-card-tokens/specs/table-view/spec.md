## ADDED Requirements

### Requirement: Mystery tokens lie on the mystery card
During a game the tokens placed on the current mystery SHALL lie as mystery tokens on the mystery card in the tableau, one per token counted in the state, updating with every change; a solved mystery's tokens leave with the card.

#### Scenario: Three tokens on the card
- **WHEN** the current mystery holds 3 tokens
- **THEN** three mystery tokens lie on the mystery card beside the board

#### Scenario: Tokens removed
- **WHEN** a mystery token is removed by card text
- **THEN** one token fewer lies on the card
