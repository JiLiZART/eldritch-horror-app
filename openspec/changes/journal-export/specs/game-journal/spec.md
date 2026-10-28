## MODIFIED Requirements

### Requirement: The journal is shown beside the board
While a game is in progress the panel SHALL offer the journal, folded by default with its line count, and unfolded SHALL list the lines grouped by round, oldest first, each with its phase and the investigator's name when one is involved. A text filter above the journal SHALL narrow its lines to those containing the typed text, matching without regard to case, in any round; an empty filter shows all. A Copy journal control SHALL put the whole journal on the clipboard as plain text, one line per entry under its round heading, phrased as shown.

#### Scenario: Shown
- **WHEN** Leo Anderson rested in round 1 and finished his encounter
- **THEN** the unfolded journal lists round 1 with "Leo Anderson: rest" under the Action phase and his encounter lines under the Encounter phase

#### Scenario: Filter the journal
- **WHEN** the player types "rest" into the journal filter
- **THEN** only the lines containing that text remain, under their rounds, and clearing the filter shows every line again

#### Scenario: Copy the journal
- **WHEN** the player activates Copy journal after two rounds
- **THEN** the clipboard holds the round headings and every line as the journal shows them
