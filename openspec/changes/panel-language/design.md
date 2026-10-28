## Context

See proposal.md. `content` in `client.ts` resolves `{ board, set, labels, strings }` with `strings: Record<Lang, Record<string, string>>` from the board i18n files; `App.tsx` owns `lang` and remembers it; `Panel` gets `lang` but the phase panels are children rendered by `App`. The content validator walks `content/`.

## Goals / Non-Goals

**Goals:**
- One lookup, one context, flat keys, parity enforced by tests; English output byte-identical.

**Non-Goals:**
- Log lines (see proposal).

## Decisions

### D1. Flat keys by component
`panel.json` keys read `turn.endTurn`, `encounter.finish`, `newGame.start`; values are the exact English strings of today, so the English scenario is a diff of zero. Layer: content.

### D2. `LangProvider` and `useT()` in `src/table/lang.tsx`
A context holding `{ lang, strings }`; `useT()` returns `(key, vars?) => string` with `{name}` placeholders replaced; a missing key returns the key itself and is caught by the test in D4, never by a player. `App.tsx` wraps the layout once. Layer: view.
- Rejected: passing `t` as a prop. Seven components and their children would all grow a prop.

### D3. Loading
`client.ts` fetches `/content/panel/i18n/en.json` and `ru.json` beside the board files into `panel: Record<Lang, Record<string, string>>`. Layer: content client.

### D4. Parity and usage tests
`validate.ts` compares the key sets of the two panel files; `lang.test.ts` scans `src/table/**/*.tsx` for `t("...")` literals and asserts each key exists in `en.json` and `ru.json`. Layer: test.

## Risks / Trade-offs

- Russian terms must match the glossary → the values are copied from `content/rules/glossary.md`'s `### English / Русский` lines where a term exists.
- Interpolated strings with names → `{name}` placeholders keep word order per language.

## Open Questions

- None.
