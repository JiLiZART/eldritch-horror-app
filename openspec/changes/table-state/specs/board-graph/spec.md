## MODIFIED Requirements

### Requirement: Every space on the board is described
The board data SHALL contain one entry per space drawn on `inspired/All_boards.jpg`, with a stable id, a display name in English and Russian, a kind (city, wilderness or sea), a region (America, Europe, Asia, or none), normalized coordinates on the board texture, and the set that activates it (core, Mountains of Madness, Under the Pyramids, The Dreamlands). Numbered spaces carry the kind printed on the board: 1, 5, 6, 7, 14, 15, 16, 17 and 20 are cities without a gate token.

#### Scenario: Core space
- **WHEN** the board data is loaded
- **THEN** it contains London as a city in the Europe region activated by the core set, with coordinates inside the unit square

#### Scenario: Side-board space
- **WHEN** the board data is loaded
- **THEN** it contains Lake Camp as a wilderness space activated by Mountains of Madness, and marks it inactive when only the core set is enabled

#### Scenario: Numbered sea space
- **WHEN** the board data is loaded
- **THEN** every numbered space 1 to 21 exists with its printed kind, space 15 is a city and space 2 is a sea
