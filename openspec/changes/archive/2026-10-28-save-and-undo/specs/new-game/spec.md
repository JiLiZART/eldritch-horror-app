## MODIFIED Requirements

### Requirement: A game can be abandoned
While a game is in progress the players SHALL be able to abandon it and return to the choices. Abandoning SHALL also clear the saved game, so a reload shows the New game form.

#### Scenario: New game
- **WHEN** the players abandon a game
- **THEN** the board shows no pieces and the form is offered again with the previous choices kept

#### Scenario: Save cleared
- **WHEN** the game is abandoned and the page is reloaded
- **THEN** the New game form is shown with no game resumed
