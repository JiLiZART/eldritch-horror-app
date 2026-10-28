# detained-investigator Specification

## Purpose
Model the Detained condition: the investigator cannot move, and their Encounter phase turn resolves the card's back instead of any encounter. Source: `inspired/manual_eng.pdf` p.4 "Conditions"; `inspired/EH_reference.pdf` p.5 "Контакты", p.10.

## Requirements

### Requirement: A Detained investigator cannot move
An investigator holding a Detained condition SHALL be refused Travel and SHALL NOT be moved by card text; the refusal SHALL say a Detained investigator cannot move. Other actions stay allowed. **Deviation**: further text on the card front is the players' call.

#### Scenario: Travel refused
- **WHEN** a Detained Leo Anderson travels to an adjacent space
- **THEN** it is refused because a Detained investigator cannot move

#### Scenario: Card-text move refused
- **WHEN** a Detained Leo Anderson is moved to Arkham by card text
- **THEN** it is refused because a Detained investigator cannot move

#### Scenario: Rest allowed
- **WHEN** a Detained Leo Anderson rests
- **THEN** he recovers as usual

### Requirement: The back replaces the encounter
In the Encounter phase a Detained investigator SHALL neither fight nor draw: both are refused saying the condition's back is resolved instead; the back SHALL be shown; finishing the encounter SHALL be allowed with monsters on the space unfought. **Deviation**: the back's text is applied by the players with the usual effects.

#### Scenario: Fight refused
- **WHEN** a Detained Leo Anderson with a Ghoul on his space fights it
- **THEN** it is refused because the back of Detained is resolved instead

#### Scenario: Draw refused
- **WHEN** a Detained Leo Anderson draws from the America deck
- **THEN** it is refused because the back of Detained is resolved instead

#### Scenario: Finish with a monster
- **WHEN** a Detained Leo Anderson with a Ghoul on his space finishes his encounter
- **THEN** Lily Chen is encountering and the Ghoul still stands

#### Scenario: Back shown
- **WHEN** the Encounter phase reaches a Detained investigator
- **THEN** the Detained card's back is shown with no fight or draw control
