## MODIFIED Requirements

### Requirement: The investigator sheets lie below the board
During a game each investigator's sheet SHALL lie faceup in a row below the board, in seat order from the board's left edge, one per investigator in the game including a replaced or defeated one until they are removed; the table SHALL extend to hold the row, and clicking a sheet SHALL bring it up to read like any card face. While an investigator resolves an encounter card, that card SHALL lie to the right of their sheet until the encounter is finished.

#### Scenario: Two sheets at set-up
- **WHEN** a game is set up with Leo Anderson and Lily Chen
- **THEN** Leo Anderson's sheet lies below the board's left edge with Lily Chen's to its right, and zooming out fully shows both

#### Scenario: A newcomer's sheet
- **WHEN** Charlie Kane takes a defeated Leo Anderson's seat
- **THEN** Charlie Kane's sheet lies in Leo Anderson's place in the row, after the seat before him

#### Scenario: Read a sheet
- **WHEN** the player clicks Lily Chen's sheet
- **THEN** the view glides and zooms onto it and the selected space is unchanged

#### Scenario: The encounter card beside the sheet
- **WHEN** Leo Anderson draws a general encounter card
- **THEN** the card lies to the right of his sheet, readable by click, and leaves when the encounter is finished
