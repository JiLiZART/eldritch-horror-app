## MODIFIED Requirements

### Requirement: A space can be selected
Clicking a marker SHALL select that space and show its id, English and Russian names, kind, region, set, its neighbours with the path type to each, and the pieces standing on it. Clicking empty table SHALL clear the selection. When the active investigator changes in the Action or Encounter phase, their space SHALL become the selected space, so the camera follows the turn; a route being picked SHALL NOT be disturbed.

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
