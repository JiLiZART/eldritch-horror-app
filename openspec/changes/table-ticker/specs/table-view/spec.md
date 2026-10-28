## ADDED Requirements

### Requirement: The last journal line is shown on the table
During a game the table's corner SHALL show the latest journal entry under the status line, with its phase word in the panel's language and the entry's text as logged, so a screen showing the table without the panel tells what just happened; with an empty journal nothing is shown.

#### Scenario: After a rest
- **WHEN** Leo Anderson rests and the panel is hidden
- **THEN** the table's corner shows the Action phase word, Leo Anderson and the rest, as the journal's last line reads
