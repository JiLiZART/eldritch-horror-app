# skill-improvement Specification

## Purpose
Model improvement tokens: card text improves a skill by one step up to +2, tests count the token, and defeat discards it. Source: `inspired/manual_eng.pdf` p.3 "Tests", p.4 "Defeated", p.9 "Improvement tokens"; `inspired/EH_reference.pdf` p.10, p.13.

## Requirements

### Requirement: A skill is improved by card text
In the Encounter and Mythos phases a standing investigator SHALL improve a named skill by one step: +1 with no token, +2 with a +1 token; a third improvement SHALL be refused because a skill is improved at most twice. Card text discarding an improvement SHALL take the token one step back and SHALL be refused when the skill has none. The log SHALL say the skill's new improvement. **Deviation**: impairment tokens are not modelled; possession bonuses stay with the players.

#### Scenario: Improved
- **WHEN** Leo Anderson improves Lore by card text
- **THEN** his Lore improvement is +1 and the log says so

#### Scenario: Improved twice
- **WHEN** Leo Anderson with Lore at +1 improves Lore
- **THEN** his Lore improvement is +2

#### Scenario: Third refused
- **WHEN** Leo Anderson with Lore at +2 improves Lore
- **THEN** it is refused because a skill is improved at most twice

#### Scenario: Improvement discarded
- **WHEN** Leo Anderson with Lore at +2 discards a Lore improvement
- **THEN** his Lore improvement is +1

#### Scenario: Nothing to discard
- **WHEN** Leo Anderson with no Lore improvement discards one
- **THEN** it is refused because Lore is not improved

### Requirement: Improvements are shown beside the board
Wherever card text is applied the players SHALL see a skill choice with Improve and Discard improvement for the chosen investigator, and each investigator's improvements SHALL be listed with their skills and values.

#### Scenario: Listed
- **WHEN** Leo Anderson has Lore at +1 and Will at +2
- **THEN** the status lists "Lore +1, Will +2" for him
