## Context

See proposal.md. `Status` builds `sizes` from `state.decks`, the encounter decks and four piles keyed by literal names; `SET_NAMES` maps set ids to literals; `useT()` is in scope.

## Goals / Non-Goals

**Goals:**
- Keys per deck id and pile, resolved at render.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Keys
`deck.<id>` for every deck id in `GameState["decks"]` and the encounter decks (`deck.asset`, `deck.spell`, `deck.condition`, `deck.artifact`, `deck.unique-asset`, `deck.mythos`, `deck.mystery`, `deck.research`, `deck.special`, `deck.america`, `deck.europe`, `deck.asia`, `deck.general`, `deck.other-world`, `deck.expedition`), `deck.monsterCup`, `deck.setAside`, `deck.gateStack`, `deck.cluePool`, and `set.eh01` ("Core"); the Russian from the glossary where it has the term. `sizes` keeps the ids and translates when rendering. Layer: panel and content.

## Risks / Trade-offs

- A deck id without a key would render as the key → the parity test and `content:validate` catch a missing key only when the panel asks for it; the task lists every id.

## Open Questions

- None.
