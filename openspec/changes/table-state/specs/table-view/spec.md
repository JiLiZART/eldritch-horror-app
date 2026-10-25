## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: The game status is shown beside the board
While a game is in progress the panel SHALL show doom, the omen space with any eldritch tokens on it, the reference card values, the current mystery card, the reserve cards, the size of each deck, and for each investigator in seat order the lead marker, space, health, sanity, clues and possessions by card name.

#### Scenario: Status after setup
- **WHEN** a game starts with Azathoth and Akachi Onyele
- **THEN** the panel shows doom 15, omen green with 1 eldritch token, gates 1 clues 1 surge 1, one Azathoth mystery card, four reserve cards, and Akachi Onyele as lead on space 15 with 5 health, 7 sanity, 1 clue and Mists of Releh
