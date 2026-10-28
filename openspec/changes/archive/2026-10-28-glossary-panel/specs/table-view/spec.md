## ADDED Requirements

### Requirement: The rules glossary is shown beside the board
The panel SHALL offer the rules glossary, folded by default: every entry with its English and Russian names, its text and its sources, grouped under the glossary's sections, in the glossary's order; a filter box SHALL narrow the entries to those whose names or text contain the typed words, matching without regard to case. The glossary shown SHALL be the one the specs and code cite, so the two never drift.

#### Scenario: Entry shown
- **WHEN** the players unfold the glossary
- **THEN** "Delayed / Задержанный сыщик" is listed under its section with its text and source

#### Scenario: Filtered
- **WHEN** the players type "ближайш" in the filter
- **THEN** only entries naming or mentioning it remain, "Nearest / Ближайший" among them
