import type { GameSet, Skill } from "../content/types";
import { rng } from "./rng";
import type { GameState, Roll } from "./types";

export interface TestResult extends Roll {
  state: GameState;
}

const face = (state: GameState) => 1 + Math.floor(rng(state.seed * 31 + state.rolls)() * 6);
const count = (dice: number[]) => dice.filter((d) => d >= 5).length;

/**
 * Tests a skill: printed value plus modifier dice, at least 1; each 5 or 6 is a success.
 * Dice come from the seed and the state's roll counter, so two tests in one round differ and a replay repeats.
 * Deviation: possession bonuses are left to the players.
 */
export function test(state: GameState, set: GameSet, investigator: string, skill: Skill, modifier: number): TestResult {
  const sheet = set.investigators.find((i) => i.id === investigator);
  if (!sheet) throw new Error(`Unknown investigator ${investigator}`);
  const random = rng(state.seed * 31 + state.rolls);
  const improvement = state.investigators.find((i) => i.id === investigator)?.improvements[skill] ?? 0;
  const dice = Array.from({ length: Math.max(1, sheet.skills[skill] + improvement + modifier) }, () => 1 + Math.floor(random() * 6));
  return { state: { ...state, rolls: state.rolls + 1 }, investigator, dice, successes: count(dice) };
}

/** The roll waiting in the current phase, if any. */
function waiting(state: GameState): Roll | undefined {
  return state.phase.name === "action" ? state.phase.acquiring : state.phase.name === "encounter" ? state.phase.combat?.roll : undefined;
}

/** Spends 1 clue to reroll one waiting die; the new face stands even when worse (EH_reference p.8). Deviation: focus tokens and possessions are the players' call. */
export function rerollDie(state: GameState, set: GameSet, die: number): GameState {
  const roll = waiting(state);
  if (!roll) throw new Error("no roll is waiting");
  if (roll.dice[die] === undefined) throw new Error(`no die ${die + 1} in the roll`);
  const me = state.investigators.find((i) => i.id === roll.investigator)!;
  if (me.clues === 0) throw new Error("a reroll costs 1 clue");
  const dice = roll.dice.map((d, n) => (n === die ? face(state) : d));
  const next: Roll = { ...roll, dice, successes: count(dice) };
  const s: GameState = { ...state, rolls: state.rolls + 1, investigators: state.investigators.map((i) => (i === me ? { ...i, clues: i.clues - 1 } : i)) };
  if (s.phase.name === "action") return { ...s, phase: { ...s.phase, acquiring: next } };
  if (s.phase.name !== "encounter" || !s.phase.combat) throw new Error("no roll is waiting");
  const name = set.investigators.find((i) => i.id === me.id)?.name ?? me.id;
  return { ...s, phase: { ...s.phase, combat: { ...s.phase.combat, roll: next }, log: [...s.phase.log, `${name} rerolls die ${die + 1}: ${dice.join(" ")}`] } };
}
