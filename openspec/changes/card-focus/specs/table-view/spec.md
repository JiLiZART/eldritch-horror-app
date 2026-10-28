## ADDED Requirements

### Requirement: A card face can be brought up to read
Clicking a card face on the table (a reserve card, the Ancient One sheet, the mystery card or an ongoing mythos card) SHALL glide the view to that card and zoom until the card fills most of the view's height, within the zoom limits; the selection SHALL NOT change. The player's own panning and zooming afterwards SHALL hold as usual.

#### Scenario: Read the mystery
- **WHEN** the player clicks the mystery card beside the board
- **THEN** the view glides to the card and zooms in until the card fills most of the view's height, and the selected space is unchanged

#### Scenario: Reduced motion
- **WHEN** reduced motion is on and the player clicks a reserve card
- **THEN** the view is on the card at once without animation
