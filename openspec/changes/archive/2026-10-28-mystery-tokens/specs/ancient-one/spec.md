## ADDED Requirements

### Requirement: Tokens are placed on the mystery by card text
In the Encounter and Mythos phases card text SHALL place a token on the current mystery or remove one; removing from a mystery holding none SHALL be refused saying so. The count SHALL be shown with the mystery. **Deviation**: the token's kind (clue, eldritch, health) is the players' reading of the card; one count serves all.

#### Scenario: Placed
- **WHEN** card text places a token on the mystery twice
- **THEN** the mystery holds 2 tokens and the panel shows the count

#### Scenario: Nothing to remove
- **WHEN** a token is removed from a mystery holding none
- **THEN** it is refused because the mystery holds no token

## MODIFIED Requirements

### Requirement: A mystery is solved by card text
In the Encounter and Mythos phases card text SHALL solve the current mystery: it joins the solved pile and the next mystery is drawn from the mystery deck as current. Solving SHALL discard every token placed on it. Once the Ancient One is awakened the final mystery SHALL be solvable too, and before that it SHALL be refused.

#### Scenario: Solved
- **WHEN** Azathoth's current mystery is solved with 3 in the deck
- **THEN** 1 mystery is solved, a new one is current and 2 remain in the deck

#### Scenario: Final mystery before awakening
- **WHEN** the final mystery is solved while the Ancient One sleeps
- **THEN** it is refused because the final mystery is solved after the awakening

#### Scenario: Tokens discarded on solving
- **WHEN** the current mystery holds 2 tokens and is solved
- **THEN** the new current mystery holds none
