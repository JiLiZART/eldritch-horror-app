## ADDED Requirements

### Requirement: Held cards lie under their investigator's sheet
During a game each investigator's possessions and then conditions SHALL lie faceup as small card faces under that investigator's sheet, in the order held, three to a row from the sheet's left edge and wrapping to further rows; the table SHALL extend to hold the deepest row; clicking a held card SHALL bring it up to read like any card face.

#### Scenario: Starting kit under the sheet
- **WHEN** a game is set up with Leo Anderson
- **THEN** Hired Muscle lies under Leo Anderson's sheet and zooming out fully shows it

#### Scenario: A fourth card wraps
- **WHEN** an investigator holds four cards
- **THEN** the fourth lies in a second row under the first

#### Scenario: Read a held card
- **WHEN** the player clicks a held card
- **THEN** the view glides and zooms onto it and the selected space is unchanged
