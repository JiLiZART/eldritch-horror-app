## MODIFIED Requirements

### Requirement: The game and phase controls follow the chosen language
When the board language is Russian, the New game form, the Action, Encounter and Mythos panels, the Acquire Assets form, the dice, the Trade form, the Game section, the panel's section headings, the five card-text groups with their shell, the Status table, the piece labels (on hover and in the selected space's piece list), the Selected space section's field names, its prompt and its empty markers, the Journal's phase words and its component-action prefix, and the Status section's deck and pile names and the set names SHALL show their labels, headings and notes in Russian, using the glossary's Russian names for rules terms; in English they SHALL read as today. Card names, investigator names, space names and the engine's log lines stay as the content and the engine give them.

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
