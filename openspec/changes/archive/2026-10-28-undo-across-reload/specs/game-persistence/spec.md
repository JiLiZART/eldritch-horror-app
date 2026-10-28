## MODIFIED Requirements

### Requirement: The last step can be undone
A control beside the board SHALL revert the game to the state before the last accepted step, repeatedly, back to the freshly set-up game, after which it SHALL be disabled; a refused step SHALL NOT be undone since nothing changed; the last ten prior states SHALL be saved with the game in its slot, so a resumed game can undo those steps and no more.

#### Scenario: Undone
- **WHEN** Leo Anderson rests and Undo is chosen
- **THEN** his health and sanity are as before and Rest is not spent

#### Scenario: Nothing to undo
- **WHEN** the game has just been set up
- **THEN** Undo is disabled

#### Scenario: Refusal not undone
- **WHEN** a refused Rest is followed by Undo
- **THEN** the step before the refusal is undone

#### Scenario: Undo survives a reload
- **WHEN** the page is reloaded after two steps
- **THEN** the game resumes and Undo reverts those two steps, then is disabled

#### Scenario: History is bounded
- **WHEN** the page is reloaded after twelve steps
- **THEN** Undo reverts ten steps, then is disabled

#### Scenario: Session only
- **WHEN** a game is loaded from a file
- **THEN** it starts with nothing to undo, since the file holds one state
