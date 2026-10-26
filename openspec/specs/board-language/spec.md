# board-language Specification

## Purpose

Draw the text printed on the board in the language the player chooses, so the same board reads correctly in English and in Russian.

## Requirements

### Requirement: The printed board text is drawn in the chosen language
The board SHALL show, in the chosen language, every string printed on the original board: each location name and subtitle, the Antarctica location rules, the doom track, omen track and reserve headers, the legend labels, the three side-board rules boxes and the Bank Loan card. Each string SHALL sit where the original printed it and stay inside that area. Skill names written as icons on the original board SHALL be shown as the skill icons.

#### Scenario: English board
- **WHEN** the board language is English
- **THEN** London reads "London" with "New clues" below it, and the doom track header reads "Doom Track"

#### Scenario: Russian board
- **WHEN** the board language is Russian
- **THEN** London reads "Лондон" and the doom track header reads "Шкала безысходности", and no English board text remains visible

#### Scenario: Long translation
- **WHEN** a translated name is longer than the original
- **THEN** it is drawn smaller so it still fits inside the area of the original name

#### Scenario: Skill icon
- **WHEN** the board shows San Francisco's subtitle
- **THEN** the subtitle ends with the observation icon rather than the word "{observation}"

### Requirement: The player chooses the board language
The player SHALL be able to switch the board language between English and Russian at any time, including during a game, without changing the game in progress. The choice SHALL be remembered on this device; with no remembered choice the language SHALL be Russian when the browser prefers Russian and English otherwise.

#### Scenario: Switch during a game
- **WHEN** a game is in progress and the player switches the board language to Russian
- **THEN** the board text changes to Russian and every piece, the doom value and the turn stay as they were

#### Scenario: Remembered choice
- **WHEN** the player chose Russian and reloads the page
- **THEN** the board text is in Russian

#### Scenario: First visit
- **WHEN** the player opens the app for the first time in a browser that prefers Russian
- **THEN** the board text is in Russian
