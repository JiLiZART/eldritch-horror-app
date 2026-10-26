import type { GameSet, Skill } from "../content/types";
import { rng } from "./rng";
import type { GameState } from "./types";

export interface TestResult {
  state: GameState;
  /** Faces rolled, 1 to 6. */
  dice: number[];
  /** Dice showing 5 or 6; the test passes with at least 1. */
  successes: number;
}

/**
 * Tests a skill: printed value plus modifier dice, at least 1; each 5 or 6 is a success.
 * Dice come from the seed and the state's roll counter, so two tests in one round differ and a replay repeats.
 * Deviation: possession bonuses, improvements, rerolls and clues are left to the players.
 */
export function test(state: GameState, set: GameSet, investigator: string, skill: Skill, modifier: number): TestResult {
  const sheet = set.investigators.find((i) => i.id === investigator);
  if (!sheet) throw new Error(`Unknown investigator ${investigator}`);
  const random = rng(state.seed * 31 + state.rolls);
  const dice = Array.from({ length: Math.max(1, sheet.skills[skill] + modifier) }, () => 1 + Math.floor(random() * 6));
  return { state: { ...state, rolls: state.rolls + 1 }, dice, successes: dice.filter((d) => d >= 5).length };
}
