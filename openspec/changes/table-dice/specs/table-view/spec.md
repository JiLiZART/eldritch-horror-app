## ADDED Requirements

### Requirement: The open roll's dice are shown on the table
While a roll waits on the players, in Acquire Assets or in a combat step, the table's corner SHALL show the dice rolled, faces as numbers with the successes marked, and who rolled, in the panel's language, so a screen showing the table without the panel sees the roll; with no open roll nothing is shown.

#### Scenario: A combat roll on the table
- **WHEN** Leo Anderson's Will test in combat has rolled 2, 5 and 3 and waits on the players
- **THEN** the table's corner shows the three faces with the 5 marked as a success and names Leo Anderson

#### Scenario: Nothing open
- **WHEN** the roll has been settled
- **THEN** the corner shows no dice
