## MODIFIED Requirements

### Requirement: The game and phase controls follow the chosen language
When the board language is Russian, the New game form, the Action, Encounter and Mythos panels, the Acquire Assets form, the dice, the Trade form, the Game section, the panel's section headings, the five card-text groups with their shell, and the Status table SHALL show their labels, headings and notes in Russian, using the glossary's Russian names for rules terms; in English they SHALL read as today. Card names, investigator names, space names and the engine's log lines stay as the content and the engine give them.

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
