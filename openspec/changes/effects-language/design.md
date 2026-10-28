## Context

See proposal.md and the archived `panel-language` design: `useT()` with `{name}` placeholders, keys flat by component, parity and usage tests in place. The groups build some labels from data ("Cultist (4)", "Byakhee on London") and the Status table joins several values into one line.

## Goals / Non-Goals

**Goals:**
- Same mechanism; English output unchanged; keys named `effects.*` and `status.*`.

**Non-Goals:**
- Log lines (see proposal).

## Decisions

### D1. Data-built labels keep their data, translate their words
"{name} on {space}", "{name} ({count})", "Move to {space}" and "Spawn named on {space}" become placeholder strings; names and spaces stay as the content gives them. Layer: view.

### D2. The Status marks as separate keys
"(defeated by {cause})", "(devoured)", ", removed", ", replaced by {name}", "(delayed)", "(awakened)" are keys joined in code as today, so the English line is byte-identical. Layer: view.

### D3. Options from enumerations
Skills, nearest targets, decks, tickets and omen colours get `skill.*`, `nearest.*`, `deck.*`, `ticket.*` and `omen.*` keys; deck ids in the Decks line stay raw, being content ids. Layer: view.

## Risks / Trade-offs

- Around 90 more keys → the usage test keeps every one honest; the parity check keeps the two files aligned.

## Open Questions

- None.
