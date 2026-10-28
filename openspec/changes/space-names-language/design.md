## Context

See proposal.md. The engine's `spaceName(content, id)` returns the English name for logs and refusals; the panels reuse it for button labels; `LangProvider` holds the language; `Space.name` is `{ en, ru }`.

## Goals / Non-Goals

**Goals:**
- One hook for the panel's space names; the engine's English helper stays for the engine.

**Non-Goals:**
- See proposal.

## Decisions

### D1. `useSpaceName()` in `lang.tsx`
Returns `(board, id) => board.spaces.find(s => s.id === id)?.name[lang] ?? id` bound to the provider's language. Every panel component that prints a space name uses it instead of the engine's `spaceName` or `name.en`; the engine's helper keeps serving logs and errors. Layer: panel.
- Rejected: making the engine's `spaceName` language-aware. The engine has no language and its logs stay English by the panel-language decision.

## Risks / Trade-offs

- Tests that assert English button labels in the phase panels keep passing in English; none assert Russian today.

## Open Questions

- None.
