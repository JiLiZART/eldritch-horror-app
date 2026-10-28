## Purpose
Keep the game in progress across reloads and let the players take back the last step, since the engine state is plain data and every step is a pure function. No rulebook source: this is a convenience of the digital table.

## ADDED Requirements

### Requirement: The game in progress survives a reload
After every accepted step the game SHALL be saved in the browser; opening the table again SHALL resume the saved game in the same state; an unreadable save SHALL be ignored and the New game form shown. **Deviation**: one saved game per browser.

#### Scenario: Resumed
- **WHEN** Leo Anderson has rested in round 1 and the page is reloaded
- **THEN** the table shows round 1 with Rest spent for Leo Anderson

#### Scenario: Unreadable save ignored
- **WHEN** the saved game cannot be read
- **THEN** the New game form is shown

### Requirement: The last step can be undone
A control beside the board SHALL revert the game to the state before the last accepted step, repeatedly, back to the freshly set-up game, after which it SHALL be disabled; a refused step SHALL NOT be undone since nothing changed; the undo history SHALL be kept for the session only, so a resumed game starts with nothing to undo.

#### Scenario: Undone
- **WHEN** Leo Anderson rests and Undo is chosen
- **THEN** his health and sanity are as before and Rest is not spent

#### Scenario: Nothing to undo
- **WHEN** the game has just been set up
- **THEN** Undo is disabled

#### Scenario: Refusal not undone
- **WHEN** a refused Rest is followed by Undo
- **THEN** the step before the refusal is undone

#### Scenario: Session only
- **WHEN** the page is reloaded after two steps
- **THEN** the game resumes and Undo is disabled
