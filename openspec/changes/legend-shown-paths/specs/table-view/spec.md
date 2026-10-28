## MODIFIED Requirements

### Requirement: Spaces and paths are drawn from the board data
Every active space SHALL be marked at its coordinates on the texture and every active path SHALL be drawn between its two spaces, coloured by type (train, ship, uncharted, local), matching `inspired/All_boards.jpg` and the `board-graph` capability. The path legend SHALL list only the types among the paths shown, in the order train, ship, uncharted, local.

#### Scenario: Core graph
- **WHEN** only the core set is enabled
- **THEN** 36 markers are shown and each marker sits on the printed marker of its space

#### Scenario: Path colour
- **WHEN** the path between San Francisco and space 5 is drawn
- **THEN** it uses the train colour from the legend shown on screen

#### Scenario: Legend without local paths
- **WHEN** only the core set is enabled
- **THEN** the legend reads train, ship and uncharted, and once The Dreamlands is toggled on it adds local
