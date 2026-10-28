## Context

See proposal.md. `Panel` prints `s.name` from `BOARD_SETS`, the `PATH_COLORS` keys, `selected.kind` and `selected.region` as they are.

## Goals / Non-Goals

**Goals:**
- One key per value, looked up by id.

**Non-Goals:**
- See proposal.

## Decisions

### D1. Keys by id
`t("set." + id)`, `t("path." + type)`, `t("kind." + kind)`, `t("region." + region)`; `SET_NAMES` and `BOARD_SETS[].name` go. A test in `lang.test.ts` checks every set, path type, kind and region has its key, since the coverage test only sees literal keys. The glossary's Path and Region entries give the Russian; the space kinds get a glossary entry (Город, Дикие земли, Море; unofficial). Layer: panel and content.

## Risks / Trade-offs

- None.

## Open Questions

- None.
