## MODIFIED Requirements

### Requirement: The game in progress survives a reload
After every accepted step the game SHALL be saved in the browser in its own slot, named after the Ancient One, the seed and the round, or by a name the players give the slot, which SHALL outlast later steps and reloads until they clear it; opening the table again SHALL resume the slot last played in the same state; the players SHALL be able to switch to any other saved slot, start a new game in a new slot without losing the others, and remove a slot; an unreadable save, or one written by an older state shape, SHALL be set aside and the New game form shown with a note saying the saved game could not be resumed. **Deviation**: slots live in one browser; a save written before slots existed becomes the first slot.

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
