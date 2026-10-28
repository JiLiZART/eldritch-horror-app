## Purpose
Show the panel's own words, the game form, the three phase panels and their controls, in the language chosen for the board, so a Russian-speaking table reads Russian everywhere but the English card images and the engine's rule-word logs. No rulebook source beyond the glossary's Russian names, which the panel reuses.

## ADDED Requirements

### Requirement: The game and phase controls follow the chosen language
When the board language is Russian, the New game form, the Action, Encounter and Mythos panels, the Acquire Assets form, the dice, the Trade form, the Game section and the panel's section headings SHALL show their labels, headings and notes in Russian, using the glossary's Russian names for rules terms; in English they SHALL read as today. Card names, investigator names and the engine's log lines stay as the content and the engine give them. **Deviation**: the card-text groups and the Status table follow in a later change.

#### Scenario: Russian turn panel
- **WHEN** the board language is Russian and Leo Anderson's Action turn begins
- **THEN** the panel reads "Раунд 1, Фаза действий" with the actions named Путешествие, Отдых, Подготовка к путешествию, Обмен and Приобретение активов

#### Scenario: English unchanged
- **WHEN** the board language is English
- **THEN** every label reads as before the change

### Requirement: Both languages hold the same strings
The two string files SHALL hold the same keys, and every key the panel asks for SHALL exist in both; a missing key SHALL fail the content validation and the tests rather than show at the table.

#### Scenario: Key parity
- **WHEN** a key exists in one language file but not the other
- **THEN** content validation fails naming the key
