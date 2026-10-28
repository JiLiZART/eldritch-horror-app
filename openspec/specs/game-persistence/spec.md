# game-persistence Specification

## Purpose
Keep the game in progress across reloads and let the players take back the last step, since the engine state is plain data and every step is a pure function. No rulebook source: this is a convenience of the digital table.

## Requirements

### Requirement: The game in progress survives a reload
After every accepted step the game SHALL be saved in the browser in its own slot, named after the Ancient One, the seed and the round, or by a name the players give the slot, which SHALL outlast later steps and reloads until they clear it; opening the table again SHALL resume the slot last played in the same state; another window of the same browser showing the same slot SHALL follow each accepted step as it is saved, without a reload; the Saved games list SHALL show the slots last played first, each with when it was last played; the players SHALL be able to switch to any other saved slot, start a new game in a new slot without losing the others, and remove a slot; an unreadable save, or one written by an older state shape, SHALL be set aside and the New game form shown with a note saying the saved game could not be resumed. **Deviation**: slots live in one browser; a save written before slots existed becomes the first slot.

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

#### Scenario: A named slot
- **WHEN** the players name the current slot "Tuesday group" and then rest and reload
- **THEN** the Saved games list shows "Tuesday group" for that slot, and clearing the name shows the Ancient One, seed and round again

#### Scenario: A second window follows
- **WHEN** the same slot is open in two windows of one browser and Leo Anderson rests in the first
- **THEN** the second window shows the rest within a moment, without a reload

#### Scenario: Slots in order of play
- **WHEN** two slots exist and the older one is played in
- **THEN** it moves to the top of the Saved games list, and each slot shows when it was last played

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

### Requirement: The game is saved to and loaded from a file
While a game is in progress the players SHALL be able to save it as a file named after the slot's own name when the players gave one, else after the seed and round; at any time they SHALL be able to load such a file, which replaces the game in progress with the file's state and starts with nothing to undo. An unreadable file, or one written by an older state shape, SHALL be refused with the same notes as the browser slot and leave the game as it was. **Deviation**: the file is plain JSON with no signature.

#### Scenario: Saved to a file
- **WHEN** the players save the game in round 3 of seed 42
- **THEN** a file named with 42 and 3 holds the state

#### Scenario: Loaded from a file
- **WHEN** the players load a file saved in round 3
- **THEN** the table shows round 3 as saved and Undo is disabled

#### Scenario: Unreadable file
- **WHEN** the players load a file that is not a saved game
- **THEN** the form says the saved game could not be read and the game in progress stays

#### Scenario: Named after the slot
- **WHEN** the slot is named "Tuesday group" and the players save the game
- **THEN** the file is named after that name, with characters a file system refuses replaced
