## MODIFIED Requirements

### Requirement: A card face can be brought up to read
Clicking a card face on the table (a reserve card, the Ancient One sheet, the mystery card or an ongoing mythos card) SHALL glide the view to that card and zoom until the card fills most of the view's height, within the zoom limits; the selection SHALL NOT change. The panel's card thumbnails (the mystery, the ongoing mythos cards, the reserve) and each investigator's Show sheet control SHALL bring the same card up on the table, reachable by keyboard, with the thumbnails as buttons. The player's own panning and zooming afterwards SHALL hold as usual.

#### Scenario: Read the mystery
- **WHEN** the player clicks the mystery card beside the board
- **THEN** the view glides to the card and zooms in until the card fills most of the view's height, and the selected space is unchanged

#### Scenario: Reduced motion
- **WHEN** reduced motion is on and the player clicks a reserve card
- **THEN** the view is on the card at once without animation

#### Scenario: From the panel
- **WHEN** the player activates the first reserve card's thumbnail in the Status section with the keyboard
- **THEN** the view glides and zooms onto that card on the table
