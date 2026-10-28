## RENAMED Requirements

- FROM: `### Requirement: The Ancient One's tableau lies beside the board`
- TO: `### Requirement: The Ancient One's tableau stays at the top-left of the view`

- FROM: `### Requirement: The investigator sheets lie below the board`
- TO: `### Requirement: The viewed investigator's sheet stays at the bottom-middle of the view`

- FROM: `### Requirement: Held cards lie under their investigator's sheet`
- TO: `### Requirement: Held cards lie beside the viewed sheet`

## MODIFIED Requirements

### Requirement: The board is shown on a table
When the app opens, the board texture SHALL be visible on a flat table seen from above, keeping the source aspect ratio, and the player SHALL be able to pan the view by dragging and zoom it by scroll or pinch without rotating it under the table; a scroll or pinch zoom SHALL keep the point under the pointer where it is, so zooming in lands on what the pointer rests on. The table SHALL be the board alone, with or without a game, so zooming out fully shows the whole board; the cards in the overlays over the view SHALL NOT move or scale as the view pans and zooms. Panning SHALL stop at the board's edges, except that the board SHALL move far enough for any space to clear an overlay that covers it. The panel beside the table SHALL be hideable by a control that stays visible while it is hidden, so the table fills the window on a shared screen; the choice SHALL be remembered in the browser. The panel's width SHALL be adjustable by dragging its edge, within sensible bounds, the table refitting as it changes, and the width SHALL be remembered in the browser. The arrow keys SHALL pan the view and the plus and minus keys zoom it, when no form field has keyboard focus, so the table is reachable without a pointer; the clamp and the zoom limits apply as to a drag or a scroll. The panel SHALL state the keys in one line beside the Game controls, in the panel's language: arrows pan, plus and minus zoom, Escape clears.

#### Scenario: First open
- **WHEN** the app loads
- **THEN** the whole board is visible with its printed proportions, and the doom track along the top edge is readable after zooming in

#### Scenario: Zoom limits
- **WHEN** the player zooms out as far as allowed
- **THEN** the whole board still fills a large part of the view and the camera never passes below the table

#### Scenario: Zoomed out during a game
- **WHEN** a game is in progress and the player zooms out as far as allowed
- **THEN** the whole board fills the view as it does without a game, and the Ancient One's cards and the viewed investigator's cards stay in their corners of the view

#### Scenario: Cards stay while the map moves
- **WHEN** a game is in progress and the player drags the board and zooms onto Tokyo
- **THEN** the Ancient One sheet stays at the top-left and the viewed sheet at the bottom-middle, at the same size as before

#### Scenario: Panning stops at the edge
- **WHEN** the player drags the board far past its edge
- **THEN** the view stops with the board's edge no further in than the overlays need to uncover the spaces at that edge

#### Scenario: A space under an overlay
- **WHEN** a game is in progress and the space at the board's top-left corner lies under the Ancient One sheet
- **THEN** the player can drag the board until that space is clear of the sheet and select it

#### Scenario: Edge card centred
- **WHEN** the player brings up the first held card beside the viewed sheet
- **THEN** the enlarged card sits clear of the view's edges

#### Scenario: Zoom under the pointer
- **WHEN** the pointer rests on London and the player scrolls to zoom in
- **THEN** London stays under the pointer as the view enlarges

#### Scenario: Hide the panel
- **WHEN** the player hides the panel
- **THEN** the table fills the window, the whole board still fits at full zoom-out, a Show panel control remains, and after a reload the panel is still hidden

#### Scenario: Widen the panel
- **WHEN** the player drags the panel's edge to the left
- **THEN** the panel widens, the table refits to the narrower canvas, the overlays keep their corners, and after a reload the panel keeps that width

#### Scenario: Pan and zoom by keyboard
- **WHEN** no field has focus and the player presses the right arrow, then plus
- **THEN** the view moves right by part of its width, then zooms in one step, within the table and the zoom limits

#### Scenario: Keys are stated
- **WHEN** the panel is shown in Russian
- **THEN** one line beside the Game controls names the arrow, plus, minus and Escape keys and what they do, in Russian

### Requirement: The Ancient One's tableau stays at the top-left of the view
During a game the Ancient One sheet SHALL lie faceup at the top-left corner of the view, flipped to its back once the Ancient One has awakened; the current mystery card SHALL lie beside the sheet, and the ongoing mythos cards SHALL lie in a row after the mystery, in play order, with the mythos card drawn this round lying first in that row while the Mythos phase lasts. The tableau SHALL keep its place and size while the view pans and zooms, and SHALL be empty without a game in progress. Source: `inspired/eh01_rulebook.pdf` p.4 "Setup" step 5, p.5 step 9H.

#### Scenario: Sheet and mystery at set-up
- **WHEN** a game against Azathoth is set up
- **THEN** Azathoth's sheet lies at the top-left of the view with the first mystery card beside it, and no mythos card

#### Scenario: Ongoing mythos cards
- **WHEN** two ongoing mythos cards are in play
- **THEN** both lie after the mystery card, the older one first

#### Scenario: Awakened
- **WHEN** the Ancient One awakens
- **THEN** the sheet shows its back

#### Scenario: The drawn mythos card on the table
- **WHEN** the Mythos phase opens and its card is drawn
- **THEN** that card lies first in the tableau's mythos row until the phase ends, and leaves the row unless it stays in play as an ongoing card

### Requirement: The viewed investigator's sheet stays at the bottom-middle of the view
During a game one investigator is viewed: the active investigator, unless the player has chosen another. The viewed investigator's sheet SHALL lie faceup at the bottom-middle of the view, keeping its place and size while the view pans and zooms. A row of tabs, one per investigator in seat order including a replaced or defeated one until removed, SHALL show each investigator's pawn, mark the lead investigator and the viewed one, and show a defeated investigator dimmed; choosing a tab SHALL view that investigator. When another investigator becomes active the view SHALL follow them. A defeated investigator's sheet and held cards SHALL be shown dimmed. While the viewed investigator resolves an encounter card, that card SHALL lie to the right of their sheet until the encounter is finished. Source: `inspired/eh01_rulebook.pdf` p.4 "Setup" steps 3–4.

#### Scenario: Two sheets at set-up
- **WHEN** a game is set up with Leo Anderson and Lily Chen
- **THEN** Leo Anderson's sheet lies at the bottom-middle of the view, and tabs show Leo Anderson marked as lead and viewed, then Lily Chen

#### Scenario: View another investigator
- **WHEN** Leo Anderson is active and the player chooses Lily Chen's tab
- **THEN** Lily Chen's sheet and held cards replace Leo Anderson's at the bottom-middle, and Leo Anderson is still active

#### Scenario: The view follows the turn
- **WHEN** the player is viewing Lily Chen and Leo Anderson's turn passes to Lily Chen, then hers to the next investigator
- **THEN** the bottom-middle shows the newly active investigator each time

#### Scenario: A newcomer's sheet
- **WHEN** Charlie Kane takes a defeated Leo Anderson's seat
- **THEN** Charlie Kane's tab stands in Leo Anderson's place in the row, after the seat before him

#### Scenario: Read a sheet
- **WHEN** the player clicks Lily Chen's sheet while viewing her
- **THEN** the sheet enlarges over the view and the selected space is unchanged

#### Scenario: The encounter card beside the sheet
- **WHEN** Leo Anderson draws a general encounter card
- **THEN** the card lies to the right of his sheet at the bottom of the view, and leaves when the encounter is finished

#### Scenario: A defeated investigator's sheet
- **WHEN** Leo Anderson is defeated and the player views him
- **THEN** his tab, sheet and held cards are dimmed while Lily Chen's stay as printed

### Requirement: Held cards lie beside the viewed sheet
During a game the viewed investigator's possessions and then conditions SHALL lie faceup as small card faces in a row beside their sheet at the bottom of the view, in the order held, wrapping to a further row when the row would pass the view's width, and keeping their place and size while the view pans and zooms.

#### Scenario: Starting kit under the sheet
- **WHEN** a game is set up with Leo Anderson
- **THEN** Hired Muscle lies beside Leo Anderson's sheet at the bottom of the view

#### Scenario: A fourth card wraps
- **WHEN** the viewed investigator holds more cards than fit in one row beside the sheet
- **THEN** the rest lie in a further row, all within the view

#### Scenario: Read a held card
- **WHEN** the player clicks a held card
- **THEN** the card enlarges over the view, the board does not move, and the selected space is unchanged

### Requirement: A card face can be brought up to read
Clicking a card face in an overlay (the Ancient One sheet, the mystery card, an ongoing or drawn mythos card, the viewed sheet, a held card or the encounter card) SHALL enlarge it over the view until it fills most of the view's height, without moving the board; a further click on an enlarged card that has a printed back SHALL turn it over, and the next turn it back; the Ancient One sheet and cards without a back are not turned. Escape, or a click outside the enlarged card, SHALL return it to its place. Clicking a reserve card on the board SHALL glide the view to that card and zoom until it fills most of the view's height, within the zoom limits, and a further click turns it over as above. Neither SHALL change the selection. The panel's card thumbnails (the mystery, the ongoing mythos cards, the reserve) and each investigator's Show sheet control SHALL bring the same card up, reachable by keyboard, with the thumbnails as buttons; so SHALL each possession and condition named in the Status table, viewing its holder first; and so SHALL the Encounter panel's card thumbnail and the Mythos panel's; in the Acquire Assets form each reserve card's name SHALL bring that card up as well, and in the Trade form each possession's name SHALL bring up that held card, viewing its holder first. The player's own panning and zooming afterwards SHALL hold as usual. A double-click on a monster token SHALL bring the token up to read by gliding the view, its back shown on a further click, so the token's printed text is readable at the table; the single click still selects the space. Reduced motion makes every glide and enlargement instant.

#### Scenario: Read the mystery
- **WHEN** the player clicks the mystery card at the top-left
- **THEN** the card enlarges over the view until it fills most of its height, the board does not move, and the selected space is unchanged

#### Scenario: Close an enlarged card
- **WHEN** a card is enlarged and the player presses Escape
- **THEN** the card returns to its place and the board is where it was

#### Scenario: Reduced motion
- **WHEN** reduced motion is on and the player clicks a reserve card
- **THEN** the view is on the card at once without animation

#### Scenario: From the panel
- **WHEN** the player activates the first reserve card's thumbnail in the Status section with the keyboard
- **THEN** the view glides and zooms onto that card on the board

#### Scenario: A held card from the Status table
- **WHEN** the player is viewing Leo Anderson and activates "Lucky Rabbit's Foot" in Lily Chen's possessions
- **THEN** Lily Chen becomes the viewed investigator and the card enlarges over the view

#### Scenario: The encounter card from its panel
- **WHEN** Leo Anderson has drawn an encounter card and the player activates its thumbnail in the Encounter panel
- **THEN** the encounter card enlarges over the view

#### Scenario: The mythos card from its panel
- **WHEN** the Mythos phase has drawn its card and the player activates the thumbnail in the Mythos panel
- **THEN** that card enlarges over the view

#### Scenario: A reserve card from the Acquire Assets form
- **WHEN** Leo Anderson is acquiring assets and the player activates the first reserve card's name in the form
- **THEN** the view glides and zooms onto that card in the reserve

#### Scenario: A possession from the Trade form
- **WHEN** Leo Anderson is trading with Lily Chen and the player activates "Hired Muscle" in his offer
- **THEN** Leo Anderson is viewed and the card enlarges over the view

#### Scenario: Turn a condition over
- **WHEN** a held condition is enlarged and the player clicks it again
- **THEN** the card shows its back, and another click shows its front

#### Scenario: Read a monster token
- **WHEN** the player double-clicks the Byakhee on London
- **THEN** the view glides and zooms onto the token, a further click shows its back, and the selection is London

### Requirement: Mystery tokens lie on the mystery card
During a game the tokens placed on the current mystery SHALL lie as mystery tokens on the mystery card in the tableau, one per token counted in the state, updating with every change; a solved mystery's tokens leave with the card.

#### Scenario: Three tokens on the card
- **WHEN** the current mystery holds 3 tokens
- **THEN** three mystery tokens lie on the mystery card at the top-left of the view

#### Scenario: Tokens removed
- **WHEN** a mystery token is removed by card text
- **THEN** one token fewer lies on the card
