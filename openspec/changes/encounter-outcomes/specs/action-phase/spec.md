## MODIFIED Requirements

### Requirement: Trade exchanges possessions on a shared space
Trade SHALL let the active investigator and another investigator on the same space exchange any of their possessions, clue tokens and travel tickets in both directions in one action. Items not held by the giver, conditions, or a partner on another space, SHALL be refused.

#### Scenario: Cards and clues
- **WHEN** Charlie Kane, on the same space as Jacqueline Fine, trades Personal Assistant for 1 clue
- **THEN** Jacqueline Fine holds Personal Assistant and Charlie Kane holds 1 more clue

#### Scenario: Different space
- **WHEN** Charlie Kane on San Francisco trades with Lily Chen on Shanghai
- **THEN** the trade is refused because they do not share a space

#### Scenario: Not owned
- **WHEN** an investigator gives a card they do not hold
- **THEN** the trade is refused naming the card

#### Scenario: Condition refused
- **WHEN** an investigator gives a condition card they hold
- **THEN** the trade is refused because conditions are not possessions
