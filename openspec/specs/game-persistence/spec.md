# game-persistence Specification

## Purpose
Keep the game in progress across reloads and let the players take back the last step, since the engine state is plain data and every step is a pure function. No rulebook source: this is a convenience of the digital table.

## Requirements

### Requirement: The game in progress survives a reload
After every accepted step the game SHALL be saved in the browser in its own slot, named after the Ancient One, the seed and the round; opening the table again SHALL resume the slot last played in the same state; the players SHALL be able to switch to any other saved slot, start a new game in a new slot without losing the others, and remove a slot; an unreadable save, or one written by an older state shape, SHALL be set aside and the New game form shown with a note saying the saved game could not be resumed. **Deviation**: slots live in one browser; a save written before slots existed becomes the first slot.

#### Scenario: Resumed
- **WHEN** Leo Anderson has rested in round 1 and the page is reloaded
- **THEN** the table shows round 1 with Rest spent for Leo Anderson

#### Scenario: Unreadable save ignored
- **WHEN** the saved game cannot be read
- **THEN** the New game form is shown

#### Scenario: Older save set aside
- **WHEN** the saved game was written by an older state shape
- **THEN** the New game form is shown with a note that the saved game could not be resumed

#### Scenario: Two games kept
- **WHEN** a game with Azathoth is in progress and the players start a new game with Cthulhu
- **THEN** both slots are listed and switching to the Azathoth slot resumes it where it was

#### Scenario: Slot removed
- **WHEN** the players remove the Cthulhu slot
- **THEN** it is no longer listed and the Azathoth slot is untouched

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

### Requirement: The game is saved to and loaded from a file
While a game is in progress the players SHALL be able to save it as a file named after the seed and round; at any time they SHALL be able to load such a file, which replaces the game in progress with the file's state and starts with nothing to undo. An unreadable file, or one written by an older state shape, SHALL be refused with the same notes as the browser slot and leave the game as it was. **Deviation**: the file is plain JSON with no signature.

#### Scenario: Saved to a file
- **WHEN** the players save the game in round 3 of seed 42
- **THEN** a file named with 42 and 3 holds the state

#### Scenario: Loaded from a file
- **WHEN** the players load a file saved in round 3
- **THEN** the table shows round 3 as saved and Undo is disabled

#### Scenario: Unreadable file
- **WHEN** the players load a file that is not a saved game
- **THEN** the form says the saved game could not be read and the game in progress stays
