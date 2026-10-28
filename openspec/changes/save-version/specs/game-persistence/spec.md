## MODIFIED Requirements

### Requirement: The game in progress survives a reload
After every accepted step the game SHALL be saved in the browser; opening the table again SHALL resume the saved game in the same state; an unreadable save, or one written by an older state shape, SHALL be set aside and the New game form shown with a note saying the saved game could not be resumed. **Deviation**: one saved game per browser.

#### Scenario: Resumed
- **WHEN** Leo Anderson has rested in round 1 and the page is reloaded
- **THEN** the table shows round 1 with Rest spent for Leo Anderson

#### Scenario: Unreadable save ignored
- **WHEN** the saved game cannot be read
- **THEN** the New game form is shown

#### Scenario: Older save set aside
- **WHEN** the saved game was written by an older state shape
- **THEN** the New game form is shown with a note that the saved game could not be resumed
