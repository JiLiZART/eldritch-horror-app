# board-tokens Specification

## Purpose
Keep rumor tokens and eldritch tokens on the board and the omen track as game state, placed and removed by card text, so the table shows what the cards put there. Source: `inspired/manual_eng.pdf` p.3 "Place rumor token", "Place eldritch tokens", p.4 "Eldritch tokens", "Rumors"; `inspired/EH_reference.pdf` p.4, p.11.

## Requirements

### Requirement: Rumor and eldritch tokens are placed and removed by card text
In the Encounter and Mythos phases the players SHALL place a rumor token or an eldritch token on any space they name, and remove one from a space; eldritch tokens SHALL stack on a space and rumor tokens too, one per rumor; removing a token from a space that holds none SHALL be refused naming the space, and an unknown space SHALL be refused naming it. The log SHALL say what was placed or removed where. **Deviation**: the space the card names is the players' reading; the rumor and eldritch encounters are resolved by hand.

#### Scenario: Rumor placed
- **WHEN** a rumor token is placed on London by card text
- **THEN** London holds a rumor token and the log says so

#### Scenario: Eldritch stacked
- **WHEN** two eldritch tokens are placed on Tunguska
- **THEN** Tunguska holds 2 eldritch tokens

#### Scenario: Removed
- **WHEN** the rumor token on London is removed
- **THEN** London holds no rumor token

#### Scenario: Nothing to remove
- **WHEN** an eldritch token is removed from Arkham, which holds none
- **THEN** it is refused because Arkham holds no eldritch token

### Requirement: Eldritch tokens on the omen track change by card text
In the Encounter and Mythos phases the players SHALL add an eldritch token to, or remove one from, any of the four omen track spaces; removing from an empty track space SHALL be refused naming the colour. The count on the current omen SHALL stay visible.

#### Scenario: Added on green
- **WHEN** Azathoth starts with 1 eldritch token on green and one more is added to green
- **THEN** green holds 2 eldritch tokens

#### Scenario: Empty space
- **WHEN** an eldritch token is removed from the blue space holding none
- **THEN** it is refused because blue holds no eldritch token

### Requirement: Tokens are shown on the table
A rumor token and each eldritch token on a space SHALL be shown on the table with the other pieces of the space and listed for the space beside the board; the panel SHALL offer the placing and removing controls wherever card text is applied.

#### Scenario: Shown
- **WHEN** London holds a rumor token and 2 eldritch tokens
- **THEN** the space lists "Rumor" and two "Eldritch token" pieces
