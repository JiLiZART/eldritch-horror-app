import { distance, neighbors } from "../../content/board";
import { fight, toCup } from "../encounter";
import type { Content } from "../setup";
import { note, spaceName } from "../spawn";
import type { GameState, MonsterInstance } from "../types";
import { monsterOn, name } from "./shared";

/** Card text on monsters (manual_eng.pdf p.3–4): moving, discarding, ambushes. */

/** Card text moves the token anywhere; lost health stays with it. Whether an epic monster may move is the players' call. */
export function moveMonster(state: GameState, content: Content, monster: MonsterInstance, space: string): GameState {
  const { token, label } = monsterOn(state, content, monster);
  if (!content.board.spaces.some((s) => s.id === space)) throw new Error(`no space ${space} on the board`);
  return note({ ...state, monsters: state.monsters.map((m) => (m === token ? { ...m, space } : m)) }, `${label} moves to ${spaceName(content, space)}`);
}


/** 1 space along a shortest route to the nearest standing investigator (EH_reference p.2). Deviation: ties by seat order and board order, not the active investigator's choice. */
export function moveMonsterToward(state: GameState, content: Content, monster: MonsterInstance): GameState {
  const { token, label } = monsterOn(state, content, monster);
  const standing = state.investigators.filter((i) => !i.defeated);
  const nearest = standing.reduce((best, i) => (distance(content.board, token.space, i.space) < distance(content.board, token.space, best.space) ? i : best));
  const far = distance(content.board, token.space, nearest.space);
  if (far === 0) return note(state, `${label} is already with ${name(content, nearest.id)}`);
  const step = neighbors(content.board, token.space).find((n) => distance(content.board, n, nearest.space) === far - 1)!;
  return moveMonster(state, content, monster, step);
}


/** A non-epic token returns to the cup, appended as after combat; an epic token leaves the game (EH_reference p.11, p.13). */
export function discardMonster(state: GameState, content: Content, monster: MonsterInstance): GameState {
  const { token, label, epic } = monsterOn(state, content, monster);
  const left = { ...state, monsters: state.monsters.filter((m) => m !== token) };
  return epic ? note(left, `${label} is discarded and leaves the game`) : note(toCup(left, [token]), `${label} is discarded and ${token.setAside ? "is set aside again" : "returns to the cup"}`);
}

/** "A monster ambushes you" (manual p.3): the top cup token fights at once on the investigator's space, not spawned, back to the cup afterwards. */
export function ambush(state: GameState, content: Content): GameState {
  if (state.phase.name !== "encounter") throw new Error("an ambush happens in the Encounter phase");
  const me = state.investigators.find((i) => i.id === (state.phase as { active: string }).active)!;
  const [token, ...cup] = state.monsterCup;
  if (token === undefined) throw new Error("the monster cup is empty: nothing ambushes");
  const sheet = content.set.monsters.find((m) => m.id === token.id);
  const drawn = note({ ...state, monsterCup: cup, monsters: [...state.monsters, { ...token, space: me.space, health: 0, ambush: true as const }] }, `${sheet?.name ?? token.id} ambushes ${name(content, me.id)}`);
  return fight(drawn, content, token);
}

