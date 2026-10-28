## Context

See proposal.md. `piecesOnSpace(state, set)` builds labels from literals; `translate(strings, key, vars)` in `lang.tsx` is pure and `useT()` gives the panel's bound version; the two string files are parity-checked.

## Goals / Non-Goals

**Goals:**
- Labels as keys plus variables, resolved by the caller's translator.

**Non-Goals:**
- See proposal.

## Decisions

### D1. A translator argument
`piecesOnSpace(state, set, t)` with `t: (key: string, vars?: Record<string, string | number>) => string`; keys `piece.gate`, `piece.expedition`, `piece.clue`, `piece.rumor`, `piece.eldritch`, `piece.lead`, `piece.monsterHurt` ("{name} ({count} health lost)"), `piece.delayed` ("{name} (delayed)"), `piece.defeated` ("{name} (defeated)"). The tests bind `translate` to the English file read from `content/panel/i18n/en.json`. Layer: view model, pure.
- Rejected: returning keys and translating in the view. Two consumers (hover badge, panel list) would each translate; one argument keeps `Piece.label` a finished string.

### D2. Russian strings
From the glossary: gate, clue, rumor, eldritch token, active expedition, lead investigator, delayed, defeated; health lost as "потеряно {count} здоровья". Layer: content.

## Risks / Trade-offs

- `piecesOnSpace` is memoised on state and set; adding `t` adds the language to its dependencies → recomputed on a language switch, which is the point.

## Open Questions

- None.
