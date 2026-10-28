## ADDED Requirements

### Requirement: The reserve cards lie in the printed slots
While a game is in progress the table SHALL show each reserve card's face in the printed reserve slots along the board's edge, in reserve order, and refresh them as the reserve changes; no card SHALL lie there before a game starts. The slot positions SHALL come from board data.

#### Scenario: Four cards at setup
- **WHEN** a game starts
- **THEN** the four reserve cards' faces lie in the four printed slots in order

#### Scenario: Reserve refilled
- **WHEN** Charlie Kane takes two reserve cards and the reserve refills
- **THEN** the slots show the refilled reserve
