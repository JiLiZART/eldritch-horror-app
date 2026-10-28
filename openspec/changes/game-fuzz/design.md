## Context

See proposal.md. Every engine step is a pure function `(state, ...) => state` that throws on a refusal; `rng(seed)` gives a deterministic stream; `setupGame` builds a state from the seed. The phases are `action`, `encounter`, `mythos`, `won`, `lost`.

## Goals / Non-Goals

**Goals:**
- One test file, deterministic, under a few seconds; invariants as plain assertions with the seed and step in the message.

**Non-Goals:**
- A separate harness (see proposal).

## Decisions

### D1. Steps as a table of `(state) => state` candidates per phase
The test lists candidate steps per phase, each a closure over random picks (a random held card, a random space, a random monster); one is picked per step with the seeded stream, applied inside try/catch; an `Error` whose message matches a refusal from the engine is counted and skipped, any other throw fails the test naming seed, round and step. Layer: test.
- Rejected: replaying recorded games. Random play reaches states nobody records.

### D2. Refusals are "any Error from the engine"
Engine refusals are plain `Error`s with rule words; bugs show as TypeErrors or invariant failures, not as rule refusals. So every `Error` is a refusal and every non-`Error` throw a failure; the invariants catch the rest. Layer: test.

### D3. Invariants after every step
A `check(state)` function asserts the partitions and counts from the proposal, using the setup state's totals as the reference; it runs after every applied step and once at the end. Layer: test.

### D4. Bounded play
Seeds 1 to 6, up to 20 rounds or 400 steps each, stopping at `won` or `lost`; End turn and Finish are always among the candidates so games advance. Layer: test.

## Risks / Trade-offs

- Random play rarely reaches rare branches → the seeds and the step budget are small knobs to turn later.
- Findings may be real rule bugs → each gets a regression test and a fix in this change, reported in the apply summary.

## Open Questions

- None.
