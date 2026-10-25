# rules-glossary Specification

## Purpose
Give every later spec and the engine one set of named rules terms with sources, in English and Russian, plus machine-readable enumerations for phases, actions and skills.

## Requirements

### Requirement: Terms are defined with sources
The glossary SHALL define each rules term with an English name, a Russian name, a definition, and a citation to `inspired/manual_eng.pdf` or `inspired/EH_reference.pdf` by page. Where the two sources differ, the glossary SHALL follow `inspired/EH_reference.pdf` and note the difference.

#### Scenario: Term lookup
- **WHEN** a reader looks up "delayed"
- **THEN** they find its English and Russian names, what it does to the investigator's actions, and the page it comes from

#### Scenario: Conflict recorded
- **WHEN** the summary and the reference guide disagree on a term
- **THEN** the glossary entry states the reference-guide reading and notes the summary's reading

### Requirement: Game round structure is enumerated
The glossary SHALL list the three phases in order (Action, Encounter, Mythos), the actions available in the Action phase, the encounter kinds in the Encounter phase, and the Mythos card effects in order, as data that code can import.

#### Scenario: Phase order
- **WHEN** the phase enumeration is read
- **THEN** it yields Action, Encounter, Mythos in that order

#### Scenario: Core actions
- **WHEN** the action enumeration is read for the core set
- **THEN** it contains Travel, Rest, Trade, Prepare for Travel, Acquire Assets, Component Action, and marks Focus and Gather Resources as expansion actions

### Requirement: Skills and tests are enumerated
The glossary SHALL list the five skills (Lore, Influence, Observation, Strength, Will) and define a test: roll dice equal to skill plus modifiers, minimum one die, success on 5 or 6, with rerolls from clues and focus.

#### Scenario: Skill list
- **WHEN** the skill enumeration is read
- **THEN** it yields exactly Lore, Influence, Observation, Strength, Will

### Requirement: Combat, health and sanity rules are captured
The glossary SHALL state the combat encounter steps, the health and sanity rules, and the delayed, defeated and devoured states with their effects.

#### Scenario: Combat steps
- **WHEN** the combat entry is read
- **THEN** it lists: check monster effects, resolve the Will test and lose sanity by the difference, resolve the Strength test and lose health by the difference, in that order
