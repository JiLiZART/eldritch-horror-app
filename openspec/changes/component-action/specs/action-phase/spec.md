## ADDED Requirements

### Requirement: A component action is performed once per component per round
The active investigator SHALL perform a component action on their own investigator sheet, on a possession they hold, or on a possession held by another investigator on their space (a local action); it counts as one of the turn's 2 actions, and each component SHALL be used at most once per round by anyone. A component not held by the investigator nor by an investigator on their space SHALL be refused naming it; a component used this round SHALL be refused saying so. The action's printed text is applied by the players with the usual effects. **Deviation**: whether a component prints an Action or a Local Action is the players' reading of the card.

#### Scenario: Own possession
- **WHEN** Leo Anderson performs the component action of his Hired Muscle
- **THEN** one of his 2 actions is spent and Hired Muscle is used for the round

#### Scenario: Twice refused
- **WHEN** Leo Anderson performs Hired Muscle's action again this round
- **THEN** it is refused because Hired Muscle was used this round

#### Scenario: Local action
- **WHEN** Lily Chen on Leo Anderson's space performs the action of his Hired Muscle
- **THEN** one of her actions is spent and Hired Muscle is used for the round

#### Scenario: Out of reach
- **WHEN** Lily Chen on another space performs the action of Leo Anderson's Hired Muscle
- **THEN** it is refused because Hired Muscle is not within reach

#### Scenario: Next round
- **WHEN** the next round starts
- **THEN** every component may be used again
