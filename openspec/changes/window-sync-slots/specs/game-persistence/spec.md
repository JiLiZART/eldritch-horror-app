## MODIFIED Requirements

### Requirement: The game in progress survives a reload
After every accepted step the game SHALL be saved in the browser in its own slot, named after the Ancient One, the seed and the round, or by a name the players give the slot, which SHALL outlast later steps and reloads until they clear it; opening the table again SHALL resume the slot last played in the same state; another window of the same browser showing the same slot SHALL follow each accepted step as it is saved, without a reload, and its Saved games list SHALL follow slots made, named, duplicated or removed elsewhere; the Saved games list SHALL show the slots last played first, each with when it was last played; the players SHALL be able to switch to any other saved slot, start a new game in a new slot without losing the others, duplicate a slot into a new one holding the same state and undo history, and remove a slot or abandon the game in progress after confirming it in a second step that can be declined; an unreadable save, or one written by an older state shape, SHALL be set aside and the New game form shown with a note saying the saved game could not be resumed. **Deviation**: slots live in one browser; a save written before slots existed becomes the first slot.

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

#### Scenario: Removal asks first
- **WHEN** the player presses Remove on a slot
- **THEN** the slot stays until the player confirms, and declining leaves it as it was

#### Scenario: Duplicate a slot
- **WHEN** the players duplicate the current slot in round 3 and rest in the copy
- **THEN** the copy is in round 3 with the rest taken and the original is unchanged, both listed

#### Scenario: A second window sees a new slot
- **WHEN** a new game is started in one window
- **THEN** the other window's Saved games list shows it within a moment, without a reload
