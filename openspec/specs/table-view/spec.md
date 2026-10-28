# table-view Specification

## Purpose
Show the board data on an interactive table so the graph can be inspected by eye and later changes have a scene to place pieces on.

## Requirements

### Requirement: The board is shown on a table
When the app opens, the board texture SHALL be visible on a flat table seen from above, keeping the source aspect ratio, and the player SHALL be able to pan and zoom the view without rotating it under the table; a scroll zoom SHALL keep the point under the pointer where it is, so zooming in lands on what the pointer rests on. The view SHALL stay within the table, which is the board alone without a game and the board with the tableau beside it during one, so zooming out fully shows the whole table and panning stops at its edges; the table SHALL carry a small margin around its contents, so a card at its edge can be centred when brought up to read. The panel beside the table SHALL be hideable by a control that stays visible while it is hidden, so the table fills the window on a shared screen; the choice SHALL be remembered in the browser. The panel's width SHALL be adjustable by dragging its edge, within sensible bounds, the table refitting as it changes, and the width SHALL be remembered in the browser. The arrow keys SHALL pan the view and the plus and minus keys zoom it, when no form field has keyboard focus, so the table is reachable without a pointer; the clamp and the zoom limits apply as to a drag or a scroll. The panel SHALL state the keys in one line beside the Game controls, in the panel's language: arrows pan, plus and minus zoom, Escape clears.

#### Scenario: First open
- **WHEN** the app loads
- **THEN** the whole board is visible with its printed proportions, and the doom track along the top edge is readable after zooming in

#### Scenario: Zoom limits
- **WHEN** the player zooms out as far as allowed
- **THEN** the whole board still fills a large part of the view and the camera never passes below the table

#### Scenario: Zoomed out during a game
- **WHEN** a game is in progress and the player zooms out as far as allowed
- **THEN** the board and the Ancient One sheet beside it are both in view, whichever space is selected

#### Scenario: Panning stops at the edge
- **WHEN** the player drags the table far past its edge
- **THEN** the view stops with the table's edge at the edge of the view

#### Scenario: Edge card centred
- **WHEN** the player brings up the first held card under the leftmost sheet
- **THEN** the card sits clear of the view's edges, with table margin around it

#### Scenario: Zoom under the pointer
- **WHEN** the pointer rests on London and the player scrolls to zoom in
- **THEN** London stays under the pointer as the view enlarges

#### Scenario: Hide the panel
- **WHEN** the player hides the panel
- **THEN** the table fills the window, the whole table still fits at full zoom-out, a Show panel control remains, and after a reload the panel is still hidden

#### Scenario: Widen the panel
- **WHEN** the player drags the panel's edge to the left
- **THEN** the panel widens, the table refits to the narrower canvas, and after a reload the panel keeps that width

#### Scenario: Pan and zoom by keyboard
- **WHEN** no field has focus and the player presses the right arrow, then plus
- **THEN** the view moves right by part of its width, then zooms in one step, within the table and the zoom limits

#### Scenario: Keys are stated
- **WHEN** the panel is shown in Russian
- **THEN** one line beside the Game controls names the arrow, plus, minus and Escape keys and what they do, in Russian

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
Clicking a marker, or a piece standing on a space, SHALL select that space and show its id, English and Russian names, kind, region, set, its neighbours with the path type to each, and the pieces standing on it. The space list SHALL offer a text filter that narrows it to the spaces whose name in the chosen language contains the typed text, case-insensitively; an empty filter shows all. Clicking empty table SHALL clear the selection, and so SHALL pressing Escape while the table or the panel has keyboard focus; Escape during route picking SHALL cancel the route instead, as the Cancel control does; Escape while a card is brought up to read SHALL put it down, fitting the view to the whole table, before it clears anything. When the active investigator changes in the Action or Encounter phase, their space SHALL become the selected space, so the camera follows the turn; a route being picked SHALL NOT be disturbed. The camera SHALL glide to a newly selected space once and then leave the view to the player, so dragging the table afterwards is not undone; a drag during the glide SHALL end it.

#### Scenario: Select London
- **WHEN** the player clicks the London marker
- **THEN** the panel shows London, Лондон, city, Europe, core, and lists Rome and space 14 as train neighbours and Arkham, space 9 and space 13 as ship neighbours, and the London marker is highlighted

#### Scenario: Keyboard access
- **WHEN** the player tabs through the space list and presses Enter on a space
- **THEN** that space is selected exactly as if its marker was clicked

#### Scenario: Pieces on the space
- **WHEN** a game is in progress and the player selects a city holding a gate, a monster and an investigator
- **THEN** the panel names the gate, the monster and the investigator on that space

#### Scenario: Camera follows the active investigator
- **WHEN** the turn or the encounter passes to Lily Chen on Shanghai
- **THEN** Shanghai becomes the selected space and the camera moves there

#### Scenario: Route picking undisturbed
- **WHEN** a travel route is being picked
- **THEN** the selection stays with the route until it is confirmed or cancelled

#### Scenario: Panning after the glide
- **WHEN** the view has settled on the selected space and the player drags the table aside
- **THEN** the view stays where it was dragged while the selection is unchanged

#### Scenario: Escape clears
- **WHEN** London is selected and the player presses Escape
- **THEN** nothing is selected and the panel shows the prompt to click a marker

#### Scenario: Escape cancels a route
- **WHEN** a travel route is being picked and the player presses Escape
- **THEN** the route is cancelled and the selection returns to the active investigator's space

#### Scenario: Filter the space list
- **WHEN** the player types "lon" into the space filter
- **THEN** the list shows London and no space whose name lacks that text, and clearing the filter shows every space again

#### Scenario: Click a pawn
- **WHEN** the player clicks Lily Chen's pawn on Shanghai
- **THEN** Shanghai becomes the selected space, exactly as if its marker was clicked

#### Scenario: Escape puts a card down
- **WHEN** a card has been brought up to read and the player presses Escape
- **THEN** the view glides out to the whole table and the selection is unchanged; a second Escape clears the selection

### Requirement: Pieces stand where the game state puts them
The table SHALL show the pieces of the game in progress at their spaces: each chosen investigator's pawn with its pawn image, lying on its side while the investigator is delayed or defeated and upright otherwise, a devoured or removed investigator's pawn gone, each open gate with its city's gate token, each facedown clue token, each monster with its token image and, once it has lost health, a numbered health token on it showing the health lost, the active expedition token, each rumor and eldritch token with the set's token image, the lead investigator token beside the lead's pawn, and a ring on the table under the pawn of the investigator whose turn it is in the Action or Encounter phase. Several pieces on one space SHALL remain distinguishable, and pointing at a piece SHALL show its label beside it until the pointer leaves, a touch showing it for a moment instead, since a finger cannot hover; a monster's label SHALL carry its Will test modifier and horror, its Strength test modifier and damage, and its toughness as printed on the token, the cultist's from the Ancient One sheet, in the panel's language; a gate's label SHALL name its omen colour and say when it matches the current omen; a pawn's label SHALL carry the investigator's health, sanity and clues. Before a game starts, and after one is abandoned, no piece SHALL stand on the board.

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

#### Scenario: Hover shows the combat numbers
- **WHEN** the pointer rests on a Byakhee token
- **THEN** the label names it with its Will modifier and horror, its Strength modifier and damage, and its toughness as printed on the token

#### Scenario: Hover names the gate's colour
- **WHEN** the omen is on green and the pointer rests on the gate on London, whose colour is blue
- **THEN** the label says the gate is blue and does not say it matches; when the omen moves to blue, it says the gate matches the omen

#### Scenario: Hover shows the investigator's condition
- **WHEN** the pointer rests on Lily Chen's pawn while she has 4 health, 6 sanity and 1 clue
- **THEN** the label shows her name with 4 health, 6 sanity and 1 clue beneath it

#### Scenario: The active pawn is ringed
- **WHEN** it is Lily Chen's turn in the Action phase
- **THEN** a ring lies under her pawn and under no other; when the turn passes to Leo Anderson the ring moves to his

#### Scenario: A touch shows the label
- **WHEN** a finger taps a monster token on a touch screen
- **THEN** its label shows beside it for a moment and then goes, and the tap still selects the space

### Requirement: Reduced motion is honoured
When the browser asks for reduced motion, camera moves triggered by the app SHALL be instant rather than animated.

#### Scenario: Reduced motion
- **WHEN** the OS reduced-motion setting is on and the player selects a space
- **THEN** any view change happens without animation

### Requirement: The game status is shown beside the board
While a game is in progress the panel SHALL show doom, the omen space with any eldritch tokens on it, the reference card values, the current mystery card, the reserve cards, the size of each deck, each discard pile's cards by name under a fold, and for each investigator in seat order the lead marker, space (as a control that selects that space, so the view glides to the investigator), health, sanity, clues and possessions by card name, their five skills as the printed value plus any improvement, and their sheet image on request.

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

#### Scenario: The discard piles
- **WHEN** an asset has been discarded
- **THEN** the Status section's discards fold names it under the asset discard

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

### Requirement: The rules glossary is shown beside the board
The panel SHALL offer the rules glossary, folded by default: every entry with its English and Russian names, its text and its sources, grouped under the glossary's sections, in the glossary's order; a filter box SHALL narrow the entries to those whose names or text contain the typed words, matching without regard to case. The glossary shown SHALL be the one the specs and code cite, so the two never drift.

#### Scenario: Entry shown
- **WHEN** the players unfold the glossary
- **THEN** "Delayed / Задержанный сыщик" is listed under its section with its text and source

#### Scenario: Filtered
- **WHEN** the players type "ближайш" in the filter
- **THEN** only entries naming or mentioning it remain, "Nearest / Ближайший" among them

### Requirement: The doom and omen tokens stand on their tracks
While a game is in progress the table SHALL show the doom token on the printed doom track at the space matching the current doom, the omen token on the printed omen track at the current omen's space, and one eldritch token beside each omen space per token placed there; the tokens SHALL move when doom, the omen or the eldritch tokens change, and none SHALL stand before a game starts. The track positions SHALL come from board data, not from the image, so another board can declare its own. Pointing at the doom token SHALL show the doom value, at the omen token the omen's colour and the eldritch tokens on it, and at an eldritch token on the track its omen space, in the panel's language, in the badge the pieces use.

#### Scenario: Doom advances
- **WHEN** doom goes from 15 to 14
- **THEN** the doom token stands on the track's 14 space

#### Scenario: Omen moves
- **WHEN** the omen advances from green to blue
- **THEN** the omen token stands on the blue space clockwise from the comet

#### Scenario: Eldritch tokens on the track
- **WHEN** two eldritch tokens lie on the green omen space
- **THEN** two eldritch tokens show beside the comet

#### Scenario: Hover names the track tokens
- **WHEN** the pointer rests on the doom token at doom 12, then on the omen token on green with 1 eldritch token
- **THEN** the badges read the doom value, then the omen's colour with its eldritch count, and vanish when the pointer leaves

### Requirement: The reserve cards lie in the printed slots
While a game is in progress the table SHALL show each reserve card's face in the printed reserve slots along the board's edge, in reserve order, and refresh them as the reserve changes; no card SHALL lie there before a game starts. The slot positions SHALL come from board data.

#### Scenario: Four cards at setup
- **WHEN** a game starts
- **THEN** the four reserve cards' faces lie in the four printed slots in order

#### Scenario: Reserve refilled
- **WHEN** Charlie Kane takes two reserve cards and the reserve refills
- **THEN** the slots show the refilled reserve

### Requirement: The Ancient One's tableau lies beside the board
The Ancient One sheet SHALL lie faceup to the right of the board, flipped to its back once the Ancient One has awakened; the current mystery card SHALL lie below the sheet, and the ongoing mythos cards SHALL lie in a row below the mystery, in play order, with the mythos card drawn this round lying first in that row while the Mythos phase lasts; the tableau SHALL be empty without a game in progress.

#### Scenario: Sheet and mystery at set-up
- **WHEN** a game against Azathoth is set up
- **THEN** Azathoth's sheet lies right of the board with the first mystery card below it, and no mythos card

#### Scenario: Ongoing mythos cards
- **WHEN** two ongoing mythos cards are in play
- **THEN** both lie below the mystery card, the older one first

#### Scenario: Awakened
- **WHEN** the Ancient One awakens
- **THEN** the sheet shows its back

#### Scenario: The drawn mythos card on the table
- **WHEN** the Mythos phase opens and its card is drawn
- **THEN** that card lies first in the tableau's mythos row until the phase ends, and leaves the row unless it stays in play as an ongoing card

### Requirement: A card face can be brought up to read
Clicking a card face on the table (a reserve card, the Ancient One sheet, the mystery card or an ongoing mythos card) SHALL glide the view to that card and zoom until the card fills most of the view's height, within the zoom limits; the selection SHALL NOT change. A further click on a card already brought up that has a printed back SHALL turn it over on the table, and the next turn it back; the Ancient One sheet and cards without a back are not turned. The panel's card thumbnails (the mystery, the ongoing mythos cards, the reserve) and each investigator's Show sheet control SHALL bring the same card up on the table, reachable by keyboard, with the thumbnails as buttons; so SHALL each possession and condition named in the Status table, bringing up that held card under the investigator's sheet; and so SHALL the Encounter panel's card thumbnail, bringing up the encounter card beside the sheet, and the Mythos panel's, bringing up the drawn mythos card in the tableau; in the Acquire Assets form each reserve card's name SHALL bring that card up as well, and in the Trade form each possession's name SHALL bring up that held card under its holder's sheet. The player's own panning and zooming afterwards SHALL hold as usual. A double-click on a monster token SHALL bring the token up to read in the same way, its back shown on a further click, so the token's printed text is readable at the table; the single click still selects the space.

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

#### Scenario: A reserve card from the Acquire Assets form
- **WHEN** Leo Anderson is acquiring assets and the player activates the first reserve card's name in the form
- **THEN** the view glides and zooms onto that card in the reserve

#### Scenario: A possession from the Trade form
- **WHEN** Leo Anderson is trading with Lily Chen and the player activates "Hired Muscle" in his offer
- **THEN** the view glides and zooms onto that card under his sheet

#### Scenario: Turn a condition over
- **WHEN** a held condition has been brought up and the player clicks it again
- **THEN** the card shows its back on the table, and another click shows its front

#### Scenario: Read a monster token
- **WHEN** the player double-clicks the Byakhee on London
- **THEN** the view glides and zooms onto the token, a further click shows its back, and the selection is London

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

### Requirement: Health and sanity tokens lie on the sheets
During a game each investigator's sheet SHALL carry a health token showing their current health on the printed heart and a sanity token showing their current sanity on the printed brain, updating with every change; a defeated investigator's sheet SHALL show the zero token on the side that fell.

#### Scenario: Tokens at set-up
- **WHEN** a game is set up with Lily Chen
- **THEN** her sheet shows a 6 health token on the heart and a 6 sanity token on the brain

#### Scenario: Tokens follow the state
- **WHEN** Lily Chen loses 2 health
- **THEN** the token on her heart shows 4 and the one on her brain still shows 6

### Requirement: Improvement and ticket tokens lie on the sheets
During a game each improved skill SHALL carry an improvement token on that skill's printed box on the investigator's sheet, two tokens stacked for a second improvement, and each travel ticket held SHALL lie as a train or ship token in the sheet's top-right corner, updating with every change.

#### Scenario: An improved skill
- **WHEN** Lily Chen has improved Strength twice and Lore once
- **THEN** two tokens lie on her Strength box, one on her Lore box, and none on the others

#### Scenario: Tickets held
- **WHEN** Leo Anderson holds a train ticket and a ship ticket
- **THEN** a train token and a ship token lie in the top-right corner of his sheet

### Requirement: The view can be fitted to the table again
A Fit table control beside the board, and a double-click on empty table, SHALL glide the view back to the whole table at the zoom-out limit, in the panel's language; it SHALL be reachable by keyboard; reduced motion makes the move instant.

#### Scenario: Fit after reading a card
- **WHEN** the player has zoomed onto a card and chooses Fit table
- **THEN** the view glides out until the whole table is in view, with the selection unchanged

#### Scenario: In Russian
- **WHEN** the panel language is Russian
- **THEN** the control is labelled in Russian

#### Scenario: Double-click fits
- **WHEN** the player has zoomed in and double-clicks on empty table
- **THEN** the view glides out until the whole table is in view, with the selection unchanged

### Requirement: Mystery tokens lie on the mystery card
During a game the tokens placed on the current mystery SHALL lie as mystery tokens on the mystery card in the tableau, one per token counted in the state, updating with every change; a solved mystery's tokens leave with the card.

#### Scenario: Three tokens on the card
- **WHEN** the current mystery holds 3 tokens
- **THEN** three mystery tokens lie on the mystery card beside the board

#### Scenario: Tokens removed
- **WHEN** a mystery token is removed by card text
- **THEN** one token fewer lies on the card

### Requirement: Card faces name themselves on hover
Pointing at a card face on the table (a reserve card, the Ancient One sheet, the mystery card, an ongoing mythos card, an investigator sheet or a held card) SHALL show its name beside it until the pointer leaves, a reserve card with its value as well, in the badge the pieces use.

#### Scenario: Hover names a reserve card
- **WHEN** the pointer rests on the first reserve card
- **THEN** a badge shows the card's name and its value, and vanishes when the pointer leaves

#### Scenario: Hover names a sheet
- **WHEN** the pointer rests on Lily Chen's sheet
- **THEN** the badge reads Lily Chen

### Requirement: The round and phase are shown on the table
During a game a line in a corner of the table SHALL show the round, the phase and, in the Action and Encounter phases, the investigator whose turn it is, in the panel's language, so a screen showing the table without the panel still tells where the game stands; before a game and after one ends the line SHALL show nothing or the outcome.

#### Scenario: On the table-only screen
- **WHEN** the panel is hidden in round 2 during Lily Chen's Action-phase turn
- **THEN** the table's corner reads the round, the Action phase and Lily Chen

#### Scenario: After the game ends
- **WHEN** the investigators have won
- **THEN** the table's corner says the game is won

### Requirement: The last journal line is shown on the table
During a game the table's corner SHALL show the latest journal entry under the status line, with its phase word in the panel's language and the entry's text as logged, so a screen showing the table without the panel tells what just happened; with an empty journal nothing is shown.

#### Scenario: After a rest
- **WHEN** Leo Anderson rests and the panel is hidden
- **THEN** the table's corner shows the Action phase word, Leo Anderson and the rest, as the journal's last line reads

### Requirement: The open roll's dice are shown on the table
While a roll waits on the players, in Acquire Assets or in a combat step, the table's corner SHALL show the dice rolled, faces as numbers with the successes marked, and who rolled, in the panel's language, so a screen showing the table without the panel sees the roll; with no open roll nothing is shown.

#### Scenario: A combat roll on the table
- **WHEN** Leo Anderson's Will test in combat has rolled 2, 5 and 3 and waits on the players
- **THEN** the table's corner shows the three faces with the 5 marked as a success and names Leo Anderson

#### Scenario: Nothing open
- **WHEN** the roll has been settled
- **THEN** the corner shows no dice
