## MODIFIED Requirements

### Requirement: Setup accepts a legal group
Setup SHALL take an Ancient One from the set, one to eight distinct investigators in seat order, a mythos difficulty (normal, easy or hard) and a random seed, and SHALL refuse any other input with a message naming the broken rule. The first seat holds the lead investigator token. Setup SHALL also start round 1 in the Action phase with the lead investigator active, no actions taken and no travel tickets.

#### Scenario: Nine investigators
- **WHEN** setup is asked for nine investigators
- **THEN** setup is refused and the message names the limit of eight

#### Scenario: Duplicate investigator
- **WHEN** the same investigator appears twice in seat order
- **THEN** setup is refused and the message names the investigator

#### Scenario: Lead investigator
- **WHEN** setup finishes for Leo Anderson then Lily Chen
- **THEN** Leo Anderson holds the lead investigator token

#### Scenario: First turn is the lead's
- **WHEN** a game starts with Leo Anderson then Lily Chen
- **THEN** round 1 is in the Action phase, Leo Anderson is active with no action taken, and nobody holds a travel ticket
