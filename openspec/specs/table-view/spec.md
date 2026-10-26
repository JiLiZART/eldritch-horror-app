# table-view Specification

## Purpose
Show the board data on an interactive table so the graph can be inspected by eye and later changes have a scene to place pieces on.

## Requirements

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
Clicking a marker SHALL select that space and show its id, English and Russian names, kind, region, set, its neighbours with the path type to each, and the pieces standing on it. Clicking empty table SHALL clear the selection.

#### Scenario: Select London
- **WHEN** the player clicks the London marker
- **THEN** the panel shows London, Лондон, city, Europe, core, and lists Rome and space 14 as train neighbours and Arkham, space 9 and space 13 as ship neighbours, and the London marker is highlighted

#### Scenario: Keyboard access
- **WHEN** the player tabs through the space list and presses Enter on a space
- **THEN** that space is selected exactly as if its marker was clicked

#### Scenario: Pieces on the space
- **WHEN** a game is in progress and the player selects a city holding a gate, a monster and an investigator
- **THEN** the panel names the gate, the monster and the investigator on that space

### Requirement: Pieces stand where the game state puts them
The table SHALL show the pieces of the game in progress at their spaces: each chosen investigator's pawn with its pawn image, each open gate with its city's gate token, each facedown clue token, each monster with its token image, and the active expedition token. Several pieces on one space SHALL remain distinguishable. Before a game starts, and after one is abandoned, no piece SHALL stand on the board.

#### Scenario: Pawn placement
- **WHEN** a game starts with Charlie Kane and Akachi Onyele
- **THEN** Charlie Kane's pawn stands on San Francisco and Akachi Onyele's pawn on space 15, and no other pawn is on the board

#### Scenario: Setup pieces
- **WHEN** a game starts with four investigators
- **THEN** one gate token stands on a named city with a monster token beside it, two facedown clue tokens lie on their spaces, and the active expedition token lies on a wilderness space

#### Scenario: Shared space
- **WHEN** two pieces are on the same space
- **THEN** both are visible without fully overlapping

#### Scenario: Empty board
- **WHEN** no game is in progress
- **THEN** the board shows markers and paths but no pawn, gate, clue, monster or expedition token

### Requirement: Reduced motion is honoured
When the browser asks for reduced motion, camera moves triggered by the app SHALL be instant rather than animated.

#### Scenario: Reduced motion
- **WHEN** the OS reduced-motion setting is on and the player selects a space
- **THEN** any view change happens without animation

### Requirement: The game status is shown beside the board
While a game is in progress the panel SHALL show doom, the omen space with any eldritch tokens on it, the reference card values, the current mystery card, the reserve cards, the size of each deck, and for each investigator in seat order the lead marker, space, health, sanity, clues and possessions by card name.

#### Scenario: Status after setup
- **WHEN** a game starts with Azathoth and Akachi Onyele
- **THEN** the panel shows doom 15, omen green with 1 eldritch token, gates 1 clues 1 surge 1, one Azathoth mystery card, four reserve cards, and Akachi Onyele as lead on space 15 with 5 health, 7 sanity, 1 clue and Mists of Releh

### Requirement: Location art responds to the pointer
Each of the 34 illustrated locations SHALL lie exactly over its art on the board. While the pointer is over it, or while its space is selected, it SHALL grow from its centre together with its printed text. Clicking it SHALL select its space exactly as clicking the space's marker does. The art of a location whose set is disabled SHALL not grow or select anything. With reduced motion the growth SHALL be instant.

#### Scenario: Hover London
- **WHEN** the pointer rests over the London illustration
- **THEN** London's art and its name grow around their centre, and shrink back when the pointer leaves

#### Scenario: Click the art
- **WHEN** the player clicks the Tokyo illustration
- **THEN** Tokyo is selected, as if its marker was clicked

#### Scenario: Disabled set
- **WHEN** Mountains of Madness is disabled and the pointer rests over the Lake Camp illustration
- **THEN** the art does not grow and clicking it selects nothing
