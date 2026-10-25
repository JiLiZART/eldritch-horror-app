## Purpose
Show the board data on an interactive table so the graph can be inspected by eye and later changes have a scene to place pieces on.

## ADDED Requirements

### Requirement: The board is shown on a table
When the app opens, the board texture SHALL be visible on a flat table seen from above, keeping the source aspect ratio, and the player SHALL be able to pan and zoom the view without rotating it under the table.

#### Scenario: First open
- **WHEN** the app loads
- **THEN** the whole board is visible with its printed proportions, and the doom track along the top edge is readable after zooming in

#### Scenario: Zoom limits
- **WHEN** the player zooms out as far as allowed
- **THEN** the whole board still fills a large part of the view and the camera never passes below the table

### Requirement: Spaces and paths are drawn from the board data
Every active space SHALL be marked at its coordinates on the texture and every active path SHALL be drawn between its two spaces, coloured by type (train, ship, uncharted, local), matching `inspired/All_boards.jpg` and the `board-graph` capability.

#### Scenario: Core graph
- **WHEN** only the core set is enabled
- **THEN** 36 markers are shown and each marker sits on the printed marker of its space

#### Scenario: Path colour
- **WHEN** the path between San Francisco and space 5 is drawn
- **THEN** it uses the train colour from the legend shown on screen

### Requirement: Sets can be toggled
The player SHALL be able to enable or disable each set that adds spaces (Mountains of Madness, Under the Pyramids, The Dreamlands). Disabling a set SHALL hide its spaces and every path touching them.

#### Scenario: Dreamlands off
- **WHEN** The Dreamlands is disabled
- **THEN** no Dreamlands marker is shown and no line leads into the Dreamlands row

#### Scenario: Core cannot be disabled
- **WHEN** the set controls are shown
- **THEN** the core set is always on and cannot be switched off

### Requirement: A space can be selected
Clicking a marker SHALL select that space and show its id, English and Russian names, kind, region, set, and its neighbours with the path type to each. Clicking empty table SHALL clear the selection.

#### Scenario: Select London
- **WHEN** the player clicks the London marker
- **THEN** the panel shows London, Лондон, city, Europe, core, and lists Rome and space 14 as train neighbours and Arkham, space 9 and space 13 as ship neighbours, and the London marker is highlighted

#### Scenario: Keyboard access
- **WHEN** the player tabs through the space list and presses Enter on a space
- **THEN** that space is selected exactly as if its marker was clicked

### Requirement: Starting pawns stand on their spaces
The twelve core investigators' pawns SHALL stand on their starting spaces using their pawn images, so that several pawns on one space remain distinguishable.

#### Scenario: Pawn placement
- **WHEN** the app loads with the core set
- **THEN** Charlie Kane's pawn stands on San Francisco and Akachi Onyele's pawn on space 15

#### Scenario: Shared space
- **WHEN** two investigators start on the same space
- **THEN** both pawns are visible without fully overlapping

### Requirement: Reduced motion is honoured
When the browser asks for reduced motion, camera moves triggered by the app SHALL be instant rather than animated.

#### Scenario: Reduced motion
- **WHEN** the OS reduced-motion setting is on and the player selects a space
- **THEN** any view change happens without animation
