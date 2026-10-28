import type { GameState } from "./types";

/** Copies the current phase's log into the journal (design D2); a no-op outside the Encounter and Mythos phases or with nothing logged. */
export function keepLog(state: GameState): GameState {
  const { phase } = state;
  if (phase.name !== "encounter" && phase.name !== "mythos") return state;
  const lines = phase.log ?? [];
  if (lines.length === 0) return state;
  const who = phase.name === "encounter" ? phase.active : undefined;
  return { ...state, journal: [...state.journal, ...lines.map((text) => ({ round: state.round, phase: phase.name, ...(who ? { who } : {}), text }))] };
}
