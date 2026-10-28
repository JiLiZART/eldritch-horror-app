## MODIFIED Requirements

### Requirement: The last step can be undone
A control beside the board SHALL revert the game to the state before the last accepted step, repeatedly, back to the freshly set-up game, after which it SHALL be disabled; a refused step SHALL NOT be undone since nothing changed; the last ten prior states SHALL be saved with the game in its slot, so a resumed game can undo those steps and no more. An undone step SHALL be redoable by a Redo control, repeatedly up to the state before the first undo, until a new step is accepted, which drops the redo line; Redo SHALL be disabled when there is nothing to redo; the redo line is kept for the session only. The platform's undo and redo keys (Ctrl or Cmd with Z, and with Shift and Z or with Y) SHALL undo and redo likewise when no form field has keyboard focus.

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

#### Scenario: Redone
- **WHEN** Leo Anderson rests, Undo is chosen and then Redo
- **THEN** the rest is back as it was and Redo is disabled

#### Scenario: A new step drops the redo line
- **WHEN** a step is undone and a different step is taken
- **THEN** Redo is disabled

#### Scenario: Undo by key
- **WHEN** Leo Anderson rests and the player presses the platform's undo key
- **THEN** the rest is undone exactly as by the Undo control, and the redo key restores it
