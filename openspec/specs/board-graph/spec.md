# board-graph Specification

## Purpose
Describe the game board as data so the engine can move investigators, spawn tokens and measure distance without reading the board image.

## Requirements

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

### Requirement: Paths connect spaces with a type
Each path SHALL join two existing spaces and carry one type: train, ship, uncharted, or local. Paths SHALL be undirected.

#### Scenario: Path to a missing space
- **WHEN** validation runs on data where a path names an unknown space
- **THEN** validation fails and names the offending path

#### Scenario: Train path
- **WHEN** the path between San Francisco and space 5 is read
- **THEN** its type is train, and the distance from San Francisco to Arkham is 2

### Requirement: Active board is connected
With any supported set combination enabled, the active spaces SHALL form a single connected graph.

#### Scenario: Core only
- **WHEN** only the core set is enabled
- **THEN** every active space is reachable from Arkham

#### Scenario: Expansion disabled
- **WHEN** The Dreamlands is disabled
- **THEN** no active path leads to a Dreamlands space

### Requirement: Distance follows the printed rule
Distance between two spaces SHALL be the number of paths on the shortest route, matching the "nearest" definition in `inspired/EH_reference.pdf`.

#### Scenario: Adjacent spaces
- **WHEN** distance is asked between two spaces joined by one path
- **THEN** the answer is 1

### Requirement: Board texture is published with the data
The board image SHALL be available as a web-sized texture whose aspect ratio matches the source, and the data SHALL record the source file and its pixel size so coordinates can be checked against it.

#### Scenario: Coordinate check
- **WHEN** a space's normalized coordinates are multiplied by the recorded source size
- **THEN** the point lands on that space's marker in `inspired/All_boards.jpg`
