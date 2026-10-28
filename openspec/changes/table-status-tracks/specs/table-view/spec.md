## MODIFIED Requirements

### Requirement: The round and phase are shown on the table
During a game a line in a corner of the table SHALL show the round, the phase and, in the Action and Encounter phases, the investigator whose turn it is, in the panel's language, so a screen showing the table without the panel still tells where the game stands; before a game and after one ends the line SHALL show nothing or the outcome. The same line SHALL state the doom value and the omen's colour with its eldritch count, so a far screen reads them without the track tokens.

#### Scenario: On the table-only screen
- **WHEN** the panel is hidden in round 2 during Lily Chen's Action-phase turn
- **THEN** the table's corner reads the round, the Action phase and Lily Chen

#### Scenario: After the game ends
- **WHEN** the investigators have won
- **THEN** the table's corner says the game is won

#### Scenario: Doom and omen in the corner
- **WHEN** doom is at 12 and the omen is on green with 1 eldritch token
- **THEN** the table's corner line states doom 12 and the green omen with its count, in the panel's language
