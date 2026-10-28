## MODIFIED Requirements

### Requirement: An investigator at 0 health or sanity is defeated
When an investigator's health or sanity reaches 0 they SHALL be defeated at once: doom advances by 1, their pawn moves to the nearest city space and lies there, their conditions are shuffled back into the condition deck, their improvement tokens are discarded, their turns are skipped for the rest of the game, and the lead token passes to the next seat when the defeated investigator held it. When every investigator is defeated the game SHALL be lost with the reason shown. The defeated investigator SHALL be shown as such beside the board and on the table. **Deviation**: among several nearest cities the first in board order is taken.

#### Scenario: Defeated by horror
- **WHEN** Leo Anderson at 1 sanity loses 1 sanity in combat at doom 12
- **THEN** he is defeated by sanity, doom is 11, and Lily Chen is encountering

#### Scenario: Relocated
- **WHEN** Leo Anderson on space 2 holding Cursed is defeated
- **THEN** his pawn lies on San Francisco and Cursed is back in the condition deck

#### Scenario: Lead passes
- **WHEN** the lead investigator is defeated
- **THEN** the next seat holds the lead token

#### Scenario: Skipped in the Action phase
- **WHEN** the next round starts with Leo Anderson defeated
- **THEN** Lily Chen is active and ending her turn opens the Encounter phase without Leo Anderson

#### Scenario: All defeated
- **WHEN** the last standing investigator is defeated
- **THEN** the game is lost and the reason says every investigator is defeated

#### Scenario: Improvements discarded
- **WHEN** Leo Anderson with Lore improved is defeated
- **THEN** his Lore improvement is gone
