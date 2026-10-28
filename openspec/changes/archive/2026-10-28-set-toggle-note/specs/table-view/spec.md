## MODIFIED Requirements

### Requirement: Sets can be toggled
The player SHALL be able to enable or disable each set that adds spaces (Mountains of Madness, Under the Pyramids, The Dreamlands). Disabling a set SHALL hide its spaces and every path touching them. While any set beyond the core is toggled on, the panel SHALL say in one line, in its language, that those spaces are a preview and the game plays on the core set.

#### Scenario: Dreamlands off
- **WHEN** The Dreamlands is disabled
- **THEN** no Dreamlands marker is shown and no line leads into the Dreamlands row

#### Scenario: Core cannot be disabled
- **WHEN** the set controls are shown
- **THEN** the core set is always on and cannot be switched off

#### Scenario: The preview note
- **WHEN** Under the Pyramids is toggled on
- **THEN** a line under the Sets controls says its spaces are a preview and the game plays on the core set; with every expansion off the line is absent
