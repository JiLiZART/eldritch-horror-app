## MODIFIED Requirements

### Requirement: Pieces stand where the game state puts them
The table SHALL show the pieces of the game in progress at their spaces: each chosen investigator's pawn with its pawn image, lying on its side while the investigator is delayed or defeated and upright otherwise, a devoured or removed investigator's pawn gone, each open gate with its city's gate token, each facedown clue token, each monster with its token image and, once it has lost health, a numbered health token on it showing the health lost, the active expedition token, each rumor and eldritch token with the set's token image, and the lead investigator token beside the lead's pawn. Several pieces on one space SHALL remain distinguishable, and pointing at a piece SHALL show its label beside it until the pointer leaves. Before a game starts, and after one is abandoned, no piece SHALL stand on the board.

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

#### Scenario: Devoured pawn gone
- **WHEN** Leo Anderson is devoured
- **THEN** his pawn is no longer on the board while the other pawns stay

#### Scenario: Lying pawn
- **WHEN** Leo Anderson is delayed or defeated
- **THEN** his pawn lies on its side on the table and stands up again once he is neither

#### Scenario: Lead token
- **WHEN** Leo Anderson holds the lead and passes it to Lily Chen
- **THEN** the lead investigator token moves from beside his pawn to beside hers

#### Scenario: Hover names a piece
- **WHEN** the pointer rests on a monster token on London
- **THEN** the monster's name and its health lost are shown beside the token, and vanish when the pointer leaves

#### Scenario: A wounded monster
- **WHEN** a monster on London has lost 2 health
- **THEN** a health token showing 2 lies on its token, and none lies on an unhurt monster
