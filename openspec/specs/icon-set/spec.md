# icon-set Specification

## Purpose
Provide the game's icons as named image files with transparency so UI and 3D surfaces can show them consistently.

## Requirements

### Requirement: Icons are named by glossary term
Each icon SHALL be stored under a name that matches a glossary term (for example clue, gate, expedition, rumor, reckoning, eldritch, mystery, doom, and the five skills) and SHALL have a transparent background.

#### Scenario: Icon lookup
- **WHEN** code asks the manifest for the clue icon
- **THEN** it receives a path to an image whose corners are transparent

#### Scenario: Unknown icon
- **WHEN** code asks for a name not in the manifest
- **THEN** the lookup fails rather than returning a placeholder

### Requirement: Manifest lists every icon with its source
The manifest SHALL list each icon with its file, pixel size, source document and page, so any icon can be re-extracted.

#### Scenario: Manifest completeness
- **WHEN** validation runs
- **THEN** every file in the icon directory appears in the manifest and every manifest entry exists on disk

### Requirement: Dice faces are available as vector art
The dice artwork SHALL be available as SVG so it scales for both UI and 3D use.

#### Scenario: Dice asset present
- **WHEN** the manifest is read
- **THEN** it includes a dice entry pointing to an SVG file
