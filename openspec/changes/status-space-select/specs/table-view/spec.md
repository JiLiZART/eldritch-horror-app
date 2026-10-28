## MODIFIED Requirements

### Requirement: The game status is shown beside the board
While a game is in progress the panel SHALL show doom, the omen space with any eldritch tokens on it, the reference card values, the current mystery card, the reserve cards, the size of each deck, and for each investigator in seat order the lead marker, space (as a control that selects that space, so the view glides to the investigator), health, sanity, clues and possessions by card name, their five skills as the printed value plus any improvement, and their sheet image on request.

#### Scenario: Status after setup
- **WHEN** a game starts with Azathoth and Akachi Onyele
- **THEN** the panel shows doom 15, omen green with 1 eldritch token, gates 1 clues 1 surge 1, one Azathoth mystery card, four reserve cards, and Akachi Onyele as lead on space 15 with 5 health, 7 sanity, 1 clue and Mists of Releh

#### Scenario: Skills listed
- **WHEN** Leo Anderson has Lore 2 printed and Lore improved by 1
- **THEN** his row lists Lore 3 among the five skills

#### Scenario: Sheet on request
- **WHEN** the players ask for Leo Anderson's sheet
- **THEN** its image is shown beside his row until hidden

#### Scenario: Find an investigator from the status
- **WHEN** the player activates Lily Chen's space in the Status table
- **THEN** Shanghai becomes the selected space and the view glides there
