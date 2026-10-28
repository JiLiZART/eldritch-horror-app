## Why

The space list below the panel holds every space of the active sets, over fifty buttons, and is the keyboard player's only way to select a space: tabbing to Tokyo means forty presses. A one-line filter above the list makes any space two keystrokes away. No rulebook source.

## What Changes

- A text field above the space list narrows it to names containing the text in the chosen language; empty shows all; translated placeholder.
- **Deviations**: none.
- Non-goals: fuzzy matching, searching ids, filtering the Status table.

## Capabilities

### New Capabilities
- none

### Modified Capabilities
- `table-view`: the space list has a text filter.

## Impact

- `src/table/Panel.tsx`; `content/panel/i18n/{en,ru}.json`: `panel.filterSpaces`. Panel only.
