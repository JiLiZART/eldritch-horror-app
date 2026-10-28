# table-view Specification

## Purpose
Show the board data on an interactive table so the graph can be inspected by eye and later changes have a scene to place pieces on.

## Requirements

### Requirement: The board is shown on a table
When the app opens, the board texture SHALL be visible on a flat table seen from above, keeping the source aspect ratio, and the player SHALL be able to pan and zoom the view without rotating it under the table. The view SHALL stay within the table, which is the board alone without a game and the board with the tableau beside it during one, so zooming out fully shows the whole table and panning stops at its edges; the table SHALL carry a small margin around its contents, so a card at its edge can be centred when brought up to read.

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
Clicking a marker SHALL select that space and show its id, English and Russian names, kind, region, set, its neighbours with the path type to each, and the pieces standing on it. Clicking empty table SHALL clear the selection. When the active investigator changes in the Action or Encounter phase, their space SHALL become the selected space, so the camera follows the turn; a route being picked SHALL NOT be disturbed. The camera SHALL glide to a newly selected space once and then leave the view to the player, so dragging the table afterwards is not undone; a drag during the glide SHALL end it.

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

### Requirement: Reduced motion is honoured
When the browser asks for reduced motion, camera moves triggered by the app SHALL be instant rather than animated.

#### Scenario: Reduced motion
- **WHEN** the OS reduced-motion setting is on and the player selects a space
- **THEN** any view change happens without animation

### Requirement: The game status is shown beside the board
While a game is in progress the panel SHALL show doom, the omen space with any eldritch tokens on it, the reference card values, the current mystery card, the reserve cards, the size of each deck, and for each investigator in seat order the lead marker, space, health, sanity, clues and possessions by card name, their five skills as the printed value plus any improvement, and their sheet image on request.

#### Scenario: Status after setup
- **WHEN** a game starts with Azathoth and Akachi Onyele
- **THEN** the panel shows doom 15, omen green with 1 eldritch token, gates 1 clues 1 surge 1, one Azathoth mystery card, four reserve cards, and Akachi Onyele as lead on space 15 with 5 health, 7 sanity, 1 clue and Mists of Releh

#### Scenario: Skills listed
- **WHEN** Leo Anderson has Lore 2 printed and Lore improved by 1
- **THEN** his row lists Lore 3 among the five skills

#### Scenario: Sheet on request
- **WHEN** the players ask for Leo Anderson's sheet
- **THEN** its image is shown beside his row until hidden

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
While a game is in progress the table SHALL show the doom token on the printed doom track at the space matching the current doom, the omen token on the printed omen track at the current omen's space, and one eldritch token beside each omen space per token placed there; the tokens SHALL move when doom, the omen or the eldritch tokens change, and none SHALL stand before a game starts. The track positions SHALL come from board data, not from the image, so another board can declare its own.

#### Scenario: Doom advances
- **WHEN** doom goes from 15 to 14
- **THEN** the doom token stands on the track's 14 space

#### Scenario: Omen moves
- **WHEN** the omen advances from green to blue
- **THEN** the omen token stands on the blue space clockwise from the comet

#### Scenario: Eldritch tokens on the track
- **WHEN** two eldritch tokens lie on the green omen space
- **THEN** two eldritch tokens show beside the comet

### Requirement: The reserve cards lie in the printed slots
While a game is in progress the table SHALL show each reserve card's face in the printed reserve slots along the board's edge, in reserve order, and refresh them as the reserve changes; no card SHALL lie there before a game starts. The slot positions SHALL come from board data.

#### Scenario: Four cards at setup
- **WHEN** a game starts
- **THEN** the four reserve cards' faces lie in the four printed slots in order

#### Scenario: Reserve refilled
- **WHEN** Charlie Kane takes two reserve cards and the reserve refills
- **THEN** the slots show the refilled reserve

### Requirement: The Ancient One's tableau lies beside the board
The Ancient One sheet SHALL lie faceup to the right of the board, flipped to its back once the Ancient One has awakened; the current mystery card SHALL lie below the sheet, and the ongoing mythos cards SHALL lie in a row below the mystery, in play order; the tableau SHALL be empty without a game in progress.

#### Scenario: Sheet and mystery at set-up
- **WHEN** a game against Azathoth is set up
- **THEN** Azathoth's sheet lies right of the board with the first mystery card below it, and no mythos card

#### Scenario: Ongoing mythos cards
- **WHEN** two ongoing mythos cards are in play
- **THEN** both lie below the mystery card, the older one first

#### Scenario: Awakened
- **WHEN** the Ancient One awakens
- **THEN** the sheet shows its back

### Requirement: A card face can be brought up to read
Clicking a card face on the table (a reserve card, the Ancient One sheet, the mystery card or an ongoing mythos card) SHALL glide the view to that card and zoom until the card fills most of the view's height, within the zoom limits; the selection SHALL NOT change. The player's own panning and zooming afterwards SHALL hold as usual.

#### Scenario: Read the mystery
- **WHEN** the player clicks the mystery card beside the board
- **THEN** the view glides to the card and zooms in until the card fills most of the view's height, and the selected space is unchanged

#### Scenario: Reduced motion
- **WHEN** reduced motion is on and the player clicks a reserve card
- **THEN** the view is on the card at once without animation

### Requirement: The investigator sheets lie below the board
During a game each investigator's sheet SHALL lie faceup in a row below the board, in seat order from the board's left edge, one per investigator in the game including a replaced or defeated one until they are removed; the table SHALL extend to hold the row, and clicking a sheet SHALL bring it up to read like any card face.

#### Scenario: Two sheets at set-up
- **WHEN** a game is set up with Leo Anderson and Lily Chen
- **THEN** Leo Anderson's sheet lies below the board's left edge with Lily Chen's to its right, and zooming out fully shows both

#### Scenario: A newcomer's sheet
- **WHEN** Charlie Kane takes a defeated Leo Anderson's seat
- **THEN** Charlie Kane's sheet lies in Leo Anderson's place in the row, after the seat before him

#### Scenario: Read a sheet
- **WHEN** the player clicks Lily Chen's sheet
- **THEN** the view glides and zooms onto it and the selected space is unchanged

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
