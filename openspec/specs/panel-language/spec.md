# panel-language Specification

## Purpose
Show the panel's own words, the game form, the three phase panels and their controls, in the language chosen for the board, so a Russian-speaking table reads Russian everywhere but the English card images and the engine's rule-word logs. No rulebook source beyond the glossary's Russian names, which the panel reuses.

## Requirements

### Requirement: The game and phase controls follow the chosen language
When the board language is Russian, the New game form, the Action, Encounter and Mythos panels, the Acquire Assets form, the dice, the Trade form, the Game section, the panel's section headings, the five card-text groups with their shell, the Status table, the piece labels (on hover and in the selected space's piece list), the Selected space section's field names, its prompt, its empty markers and its kind, region and set values, the path legend, the set controls' names, the glossary's filter label and its unofficial marker, the notes about a saved game that could not be read, was set aside or is not a backup, the Journal's phase words and its component-action prefix, and the Status section's deck and pile names and the set names SHALL show their labels, headings and notes in Russian, using the glossary's Russian names for rules terms; in English they SHALL read as today. Space names SHALL be shown in the chosen language from the board data, wherever the panel names a space: the Status table, the Selected space section and its neighbours, the space list, the phase panels and the card-text groups. Card names, investigator names and the engine's log lines stay as the content and the engine give them.

#### Scenario: Russian turn panel
- **WHEN** the board language is Russian and Leo Anderson's Action turn begins
- **THEN** the panel reads "Раунд 1, Фаза действий" with the actions named Путешествие, Отдых, Подготовка к путешествию, Обмен and Приобретение активов

#### Scenario: English unchanged
- **WHEN** the board language is English
- **THEN** every label reads as before the change

#### Scenario: Russian card-text groups
- **WHEN** the board language is Russian and an encounter card is showing
- **THEN** the groups read Сыщик, Карты, Поле, Монстры and Древний, with the health control reading "−1 здоровье"

#### Scenario: Russian status
- **WHEN** the board language is Russian during a game
- **THEN** the status reads Безысходность, Знамение, Памятка, Тайна, Резерв and the investigator table's headers in Russian

#### Scenario: Piece labels in Russian
- **WHEN** the board language is Russian and the pointer rests on a gate token, then on a monster that has lost 1 health
- **THEN** the labels read the glossary's Russian word for a gate, and the monster's name with the health lost in Russian

#### Scenario: Selected space in Russian
- **WHEN** the board language is Russian and London is selected
- **THEN** the field names for the id, name, kind, region, set, pieces and neighbours read in Russian, and with nothing selected the prompt to click a marker reads in Russian

#### Scenario: Journal in Russian
- **WHEN** the board language is Russian and the journal holds an Action-phase line and a component-action line
- **THEN** the phase word reads the glossary's Russian for the Action phase and the prefix before the component's name reads in Russian, while the engine's text after the colon stays as logged

#### Scenario: Deck names in Russian
- **WHEN** the board language is Russian
- **THEN** the Status section's Decks line names the asset deck, the monster cup, the gate stack and the clue pool with the glossary's Russian terms, and the Core set reads in Russian

#### Scenario: Space names in Russian
- **WHEN** the board language is Russian and Leo Anderson stands on Buenos Aires
- **THEN** the Status table, the space list and the Travel controls name the space Буэнос-Айрес, as the board prints it

#### Scenario: Legend values in Russian
- **WHEN** the board language is Russian and London is selected
- **THEN** the kind reads город, the region Европа and the set Базовая игра, the path legend reads поезд, корабль, тропа and местный, and the set controls read Хребты Безумия, Под пирамидами and Страна снов

#### Scenario: Glossary filter in Russian
- **WHEN** the board language is Russian and the glossary is unfolded
- **THEN** the filter box is labelled in Russian and an unofficial entry's marker reads in Russian, while the entries' names and text read as the glossary prints them

#### Scenario: Save notes in Russian
- **WHEN** the board language is Russian and a file that is not a saved game is loaded
- **THEN** the note that it could not be read shows in Russian, while an engine refusal shown in the same place keeps the engine's English

### Requirement: Both languages hold the same strings
The two string files SHALL hold the same keys, and every key the panel asks for SHALL exist in both; a missing key SHALL fail the content validation and the tests rather than show at the table.

#### Scenario: Key parity
- **WHEN** a key exists in one language file but not the other
- **THEN** content validation fails naming the key
