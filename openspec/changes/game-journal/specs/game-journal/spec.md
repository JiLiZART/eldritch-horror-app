## Purpose
Keep a lasting record of the game: every line a phase logged and every action performed, by round, phase and investigator, shown beside the board and saved with the game. No rulebook source: a convenience of the digital table.

## ADDED Requirements

### Requirement: Every phase's lines and every action are kept
When an encounter passes to the next seat or to the Mythos phase, its log lines SHALL join the journal under the round, the Encounter phase and the encountering investigator; when the next round starts, the Mythos phase's lines SHALL join it under the round and the Mythos phase; each action performed SHALL join it under the round, the Action phase and the acting investigator, as the action's name. A refused step SHALL leave no line. The journal SHALL be part of the game state, so it is saved, resumed and undone with the game, and SHALL be empty after setup.

#### Scenario: Encounter kept
- **WHEN** Leo Anderson's encounter logged "draws from the america deck: the card text is left to the players" and he finishes
- **THEN** the journal holds that line for round 1, the Encounter phase and Leo Anderson

#### Scenario: Mythos kept
- **WHEN** the mythos card of round 1 is resolved and the next round starts
- **THEN** the journal holds each resolution line for round 1 and the Mythos phase, after the encounter lines

#### Scenario: Action kept
- **WHEN** Leo Anderson rests in round 1
- **THEN** the journal holds "rest" for round 1, the Action phase and Leo Anderson

#### Scenario: Refusal not kept
- **WHEN** Leo Anderson's second Rest is refused
- **THEN** the journal is unchanged

#### Scenario: Empty after setup
- **WHEN** a game is set up
- **THEN** the journal is empty

### Requirement: The journal is shown beside the board
While a game is in progress the panel SHALL offer the journal, folded by default with its line count, and unfolded SHALL list the lines grouped by round, oldest first, each with its phase and the investigator's name when one is involved.

#### Scenario: Shown
- **WHEN** Leo Anderson rested in round 1 and finished his encounter
- **THEN** the unfolded journal lists round 1 with "Leo Anderson: rest" under the Action phase and his encounter lines under the Encounter phase
