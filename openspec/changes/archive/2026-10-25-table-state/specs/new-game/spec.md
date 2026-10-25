## Purpose
Let the players choose an Ancient One, investigators, difficulty and seed, start a game from the printed setup, and see why a choice is refused. Source: `inspired/manual_eng.pdf` p.3 "Setup" steps 2 and 3.

## ADDED Requirements

### Requirement: A game is started from the players' choices
When no game is in progress the players SHALL be offered every Ancient One and investigator of the core set, a difficulty of normal, easy or hard, and a seed. Investigators are chosen in seat order. Starting SHALL build the state by the `game-setup` capability and show it on the table and in the panel.

#### Scenario: Start with two investigators
- **WHEN** the players pick Cthulhu, then Leo Anderson and Lily Chen in that order, and start
- **THEN** Leo Anderson's pawn stands on Buenos Aires, Lily Chen's on Shanghai, doom reads 12, the omen is green, and Leo Anderson is the lead investigator

#### Scenario: Seat order
- **WHEN** the players pick Lily Chen first and Leo Anderson second
- **THEN** Lily Chen is the lead investigator

#### Scenario: Seed
- **WHEN** the players start twice with the same choices and the same seed
- **THEN** the same gates, clues, monsters, reserve and mystery appear both times

### Requirement: Refused choices are explained
When the choices cannot start a game, the reason from the setup rules SHALL be shown next to the form and no game starts.

#### Scenario: No investigator
- **WHEN** the players start with no investigator chosen
- **THEN** the form says at least one investigator is needed and the board stays empty

#### Scenario: Nine investigators
- **WHEN** nine investigators are chosen
- **THEN** the form says at most eight are allowed

### Requirement: A game can be abandoned
While a game is in progress the players SHALL be able to abandon it and return to the choices.

#### Scenario: New game
- **WHEN** the players abandon a game
- **THEN** the board shows no pieces and the form is offered again with the previous choices kept
