## MODIFIED Requirements

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
