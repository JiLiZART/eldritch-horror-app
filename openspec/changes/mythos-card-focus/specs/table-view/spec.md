## MODIFIED Requirements

### Requirement: A card face can be brought up to read
Clicking a card face on the table (a reserve card, the Ancient One sheet, the mystery card or an ongoing mythos card) SHALL glide the view to that card and zoom until the card fills most of the view's height, within the zoom limits; the selection SHALL NOT change. The panel's card thumbnails (the mystery, the ongoing mythos cards, the reserve) and each investigator's Show sheet control SHALL bring the same card up on the table, reachable by keyboard, with the thumbnails as buttons; so SHALL each possession and condition named in the Status table, bringing up that held card under the investigator's sheet; and so SHALL the Encounter panel's card thumbnail, bringing up the encounter card beside the sheet, and the Mythos panel's, bringing up the drawn mythos card in the tableau. The player's own panning and zooming afterwards SHALL hold as usual.

#### Scenario: Read the mystery
- **WHEN** the player clicks the mystery card beside the board
- **THEN** the view glides to the card and zooms in until the card fills most of the view's height, and the selected space is unchanged

#### Scenario: Reduced motion
- **WHEN** reduced motion is on and the player clicks a reserve card
- **THEN** the view is on the card at once without animation

#### Scenario: From the panel
- **WHEN** the player activates the first reserve card's thumbnail in the Status section with the keyboard
- **THEN** the view glides and zooms onto that card on the table

#### Scenario: A held card from the Status table
- **WHEN** the player activates "Hired Muscle" in Leo Anderson's possessions
- **THEN** the view glides and zooms onto that card under his sheet

#### Scenario: The encounter card from its panel
- **WHEN** Leo Anderson has drawn an encounter card and the player activates its thumbnail in the Encounter panel
- **THEN** the view glides and zooms onto that card beside his sheet

#### Scenario: The mythos card from its panel
- **WHEN** the Mythos phase has drawn its card and the player activates the thumbnail in the Mythos panel
- **THEN** the view glides and zooms onto that card first in the tableau's mythos row
