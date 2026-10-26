## MODIFIED Requirements

### Requirement: Investigators act in seat order
Starting with the lead investigator and following seat order, one investigator at a time SHALL be active. The active investigator SHALL perform up to 2 actions in the phase, each action at most once, and SHALL be able to end the turn early. When the last seat ends its turn the Mythos phase SHALL begin. **Deviation**: the Encounter phase is not modelled yet, so the Mythos phase follows the Action phase directly, and the players are told so.

#### Scenario: First turn
- **WHEN** a game starts with Leo Anderson then Lily Chen
- **THEN** round 1 is in the Action phase, Leo Anderson is active and has 2 actions left

#### Scenario: Turn passes
- **WHEN** Leo Anderson ends his turn
- **THEN** Lily Chen is active with 2 actions left

#### Scenario: Same action twice refused
- **WHEN** the active investigator who has already rested this phase rests again
- **THEN** the action is refused with the rule that each action may be performed once per phase, and nothing changes

#### Scenario: Third action refused
- **WHEN** the active investigator who has performed 2 actions this phase performs another
- **THEN** the action is refused with the rule that an investigator performs up to 2 actions, and nothing changes

#### Scenario: Round advances
- **WHEN** the last seat ends its turn and the mythos card is resolved and the next round is started
- **THEN** round 2 begins in the Action phase with the lead investigator active, and the players are told the Encounter phase was skipped
