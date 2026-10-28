import { awakenAt0 } from "./ancientOne";
import type { Random } from "./rng";
import { shuffle } from "./rng";
import type { Content } from "./setup";
import type { GameState } from "./types";

/** Spawning rules shared by setup and the Mythos phase (EH_reference.pdf p.3 gate, p.6 monster, p.13 clue). */

/** Appends a line to the Encounter or Mythos phase log; outside those phases there is nobody to tell. */
export function note(state: GameState, line: string): GameState {
  const { phase } = state;
  return phase.name === "mythos" || phase.name === "encounter" ? { ...state, phase: { ...phase, log: [...(phase.log ?? []), line] } } : state;
}

/** Card text is applied in the Encounter phase or the resolved Mythos phase. */
export function textPhase(state: GameState): void {
  if (state.phase.name !== "encounter" && state.phase.name !== "mythos") throw new Error("card text is applied in the Encounter and Mythos phases");
  if (state.phase.name === "mythos" && !state.phase.log) throw new Error("the mythos card is resolved first");
}

export const spaceName = ({ board }: Content, id: string) => board.spaces.find((s) => s.id === id)?.name.en ?? id;

/** Opens the top gate of the stack with 1 monster; reshuffles the discard first, advances doom instead when no token is left. */
export function spawnGate(state: GameState, content: Content, random: Random): GameState {
  let { gateStack, gateDiscard } = state;
  if (gateStack.length === 0 && gateDiscard.length > 0) {
    gateStack = shuffle(gateDiscard, random);
    gateDiscard = [];
  }
  const [space, ...rest] = gateStack;
  if (space === undefined) return awakenAt0(note({ ...state, doom: state.doom - 1 }, `no gate token is left: doom advances to ${state.doom - 1}`), content);
  const opened = note({ ...state, gates: [...state.gates, space], gateStack: rest, gateDiscard }, `a gate opens on ${spaceName(content, space)}`);
  return spawnMonster(opened, content, space);
}

/** Draws the top monster of the cup onto `space`, or where its token back sends it. */
export function spawnMonster(state: GameState, content: Content, space: string): GameState {
  const [token, ...cup] = state.monsterCup;
  if (token === undefined) return note(state, `the monster cup is empty: no monster spawns on ${spaceName(content, space)}`);
  const sheet = content.set.monsters.find((m) => m.id === token.id);
  const at = sheet?.spawnMoveTo ?? space;
  return note({ ...state, monsters: [...state.monsters, { ...token, space: at, health: 0 }], monsterCup: cup }, `${sheet?.name ?? token.id} spawns on ${spaceName(content, at)}`);
}

/** Places the top clue of the pool; reshuffles the discard first, places nothing when both are empty. */
export function spawnClue(state: GameState, content: Content, random: Random): GameState {
  let { cluePool, clueDiscard } = state;
  if (cluePool.length === 0 && clueDiscard.length > 0) {
    cluePool = shuffle(clueDiscard, random);
    clueDiscard = [];
  }
  const [space, ...rest] = cluePool;
  if (space === undefined) return note(state, "no clue token is left");
  return note({ ...state, clues: [...state.clues, space], cluePool: rest, clueDiscard }, `a clue appears on ${spaceName(content, space)}`);
}
