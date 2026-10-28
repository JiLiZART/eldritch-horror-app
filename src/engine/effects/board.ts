import { clueTokensLeft } from "./investigator";
import { OMEN_TRACK } from "../omen";
import { rng } from "../rng";
import type { Content } from "../setup";
import { note, spaceName, spawnClue, spawnGate, spawnMonster, textPhase } from "../spawn";
import type { GameState, MonsterOnBoard } from "../types";
import { knownSpace, name, named, randomSpace, replace, subject } from "./shared";

/** Card text on the board (manual_eng.pdf p.3–4): gates, spawns, rumor and eldritch tokens, the omen track. */

/** The gate token on the space goes to the gate discard; monsters stay (manual p.4). */
export function closeGate(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (!state.gates.includes(me.space)) throw new Error(`no gate stands on ${spaceName(content, me.space)}`);
  return note({ ...replace(state, me), gates: state.gates.filter((s) => s !== me.space), gateDiscard: [me.space, ...state.gateDiscard] }, `${name(content, id)} closes the gate on ${spaceName(content, me.space)}`);
}


export type BoardToken = "rumor" | "eldritch";

/** Card text puts a rumor or eldritch token on a space (manual p.3); the space is the players' reading of the card. */
export function placeToken(state: GameState, content: Content, kind: BoardToken, space: string): GameState {
  textPhase(state);
  knownSpace(content, space);
  const placed = kind === "rumor" ? { ...state, rumors: [...state.rumors, space] } : { ...state, eldritch: { ...state.eldritch, [space]: (state.eldritch[space] ?? 0) + 1 } };
  return note(placed, `${kind === "rumor" ? "a rumor" : "an eldritch"} token is placed on ${spaceName(content, space)}`);
}


/** Card text takes one token off a space. */
export function removeToken(state: GameState, content: Content, kind: BoardToken, space: string): GameState {
  textPhase(state);
  knownSpace(content, space);
  const held = kind === "rumor" ? state.rumors.filter((s) => s === space).length : (state.eldritch[space] ?? 0);
  if (held === 0) throw new Error(`${spaceName(content, space)} holds no ${kind} token`);
  let removed: GameState;
  if (kind === "rumor") {
    const at = state.rumors.indexOf(space);
    removed = { ...state, rumors: state.rumors.filter((_, n) => n !== at) };
  } else {
    const { [space]: _, ...rest } = state.eldritch;
    removed = { ...state, eldritch: held > 1 ? { ...rest, [space]: held - 1 } : rest };
  }
  return note(removed, `the ${kind} token on ${spaceName(content, space)} is removed`);
}


/** Card text adds or removes an eldritch token on an omen track space (manual p.4). */
export function changeEldritchOnOmen(state: GameState, slot: number, delta: number): GameState {
  textPhase(state);
  const colour = OMEN_TRACK[slot];
  if (colour === undefined) throw new Error(`no omen space ${slot}`);
  const next = state.eldritchOnOmen[slot]! + delta;
  if (next < 0) throw new Error(`the ${colour} omen space holds no eldritch token`);
  const eldritchOnOmen = state.eldritchOnOmen.map((n, i) => (i === slot ? next : n)) as GameState["eldritchOnOmen"];
  return note({ ...state, eldritchOnOmen }, `an eldritch token is ${delta > 0 ? "added to" : "removed from"} the ${colour} omen space`);
}


/** The roll stream for a card-text reshuffle, bumped so the next one differs. */
const withStream = (state: GameState, run: (s: GameState, random: () => number) => GameState): GameState => run({ ...state, rolls: state.rolls + 1 }, rng(state.seed * 31 + state.rolls));


/** "Spawn 1 Gate" by card text: the Mythos rule with the roll stream (manual p.3). */
export function spawnGateByText(state: GameState, content: Content, id: string): GameState {
  subject(state, id);
  return withStream(state, (s, random) => spawnGate(s, content, random));
}


/** "Spawn 1 Clue" by card text (manual p.3). */
export function spawnClueByText(state: GameState, content: Content, id: string): GameState {
  subject(state, id);
  return withStream(state, (s, random) => spawnClue(s, content, random));
}


/** "Spawn 1 Monster on X" by card text; the space is the players' reading of the card. */
export function spawnMonsterByText(state: GameState, content: Content, id: string, space: string): GameState {
  subject(state, id);
  knownSpace(content, space);
  return spawnMonster(state, content, space);
}


/** Card text spawns a monster of a named kind from wherever it lies in the cup; the rest keep their order. */
export function spawnNamed(state: GameState, content: Content, id: string, monsterId: string, space: string): GameState {
  subject(state, id);
  knownSpace(content, space);
  const sheet = content.set.monsters.find((m) => m.id === monsterId);
  const token = state.monsterCup.find((m) => m.id === monsterId);
  if (!token) throw new Error(`no ${sheet?.name ?? monsterId} is in the cup`);
  const at = sheet?.spawnMoveTo ?? space;
  return note({ ...state, monsterCup: state.monsterCup.filter((m) => m !== token), monsters: [...state.monsters, { ...token, space: at, health: 0 }] }, `${sheet?.name ?? monsterId} spawns on ${spaceName(content, at)}`);
}


/** Ancient One text spawns a set-aside monster by kind (manual p.4): none left of the kind means all are on the board. */
export function spawnSetAside(state: GameState, content: Content, id: string, monsterId: string, space: string): GameState {
  subject(state, id);
  knownSpace(content, space);
  const sheet = content.set.monsters.find((m) => m.id === monsterId);
  const token = state.setAsideMonsters.find((m) => m.id === monsterId);
  if (!token) throw new Error(`no ${sheet?.name ?? monsterId} is set aside`);
  const at = sheet?.spawnMoveTo ?? space;
  const spawned: MonsterOnBoard = { ...token, space: at, health: 0, setAside: true };
  return note({ ...state, setAsideMonsters: state.setAsideMonsters.filter((m) => m !== token), monsters: [...state.monsters, spawned] }, `${sheet?.name ?? monsterId} spawns from the set-aside pile on ${spaceName(content, at)}`);
}


/** "Spawn 1 Monster on a random space" by card text. */
/** With no clue token left the lead investigator names the space (EH_reference p.11; random-spawn-choice D1). */
export function spawnMonsterRandomly(state: GameState, content: Content, id: string, chosen?: string): GameState {
  subject(state, id);
  if (!clueTokensLeft(state) && chosen) return spawnMonsterByText(note(state, `no clue token is left, so the lead investigator names ${spaceName(content, chosen)}`), content, id, chosen);
  const drawn = randomSpace(state);
  return spawnMonsterByText(named(drawn.state, content, drawn.space), content, id, drawn.space);
}

