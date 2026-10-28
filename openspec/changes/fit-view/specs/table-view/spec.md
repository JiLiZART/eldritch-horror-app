## ADDED Requirements

### Requirement: The view can be fitted to the table again
A Fit table control beside the board SHALL glide the view back to the whole table at the zoom-out limit, in the panel's language; it SHALL be reachable by keyboard; reduced motion makes the move instant.

#### Scenario: Fit after reading a card
- **WHEN** the player has zoomed onto a card and chooses Fit table
- **THEN** the view glides out until the whole table is in view, with the selection unchanged

#### Scenario: In Russian
- **WHEN** the panel language is Russian
- **THEN** the control is labelled in Russian
