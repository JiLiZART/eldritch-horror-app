## ADDED Requirements

### Requirement: The game is saved to and loaded from a file
While a game is in progress the players SHALL be able to save it as a file named after the seed and round; at any time they SHALL be able to load such a file, which replaces the game in progress with the file's state and starts with nothing to undo. An unreadable file, or one written by an older state shape, SHALL be refused with the same notes as the browser slot and leave the game as it was. **Deviation**: the file is plain JSON with no signature.

#### Scenario: Saved to a file
- **WHEN** the players save the game in round 3 of seed 42
- **THEN** a file named with 42 and 3 holds the state

#### Scenario: Loaded from a file
- **WHEN** the players load a file saved in round 3
- **THEN** the table shows round 3 as saved and Undo is disabled

#### Scenario: Unreadable file
- **WHEN** the players load a file that is not a saved game
- **THEN** the form says the saved game could not be read and the game in progress stays
