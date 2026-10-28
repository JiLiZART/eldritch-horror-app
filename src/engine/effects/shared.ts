
import { reshuffle } from "../rng";
import type { Content } from "../setup";
import { note, spaceName, textPhase } from "../spawn";
import type { GameState, InvestigatorState, MonsterInstance, MonsterOnBoard } from "../types";

/** Helpers every card-text effect shares (design D1): the phase and investigator gate, naming, and the random space. */

/** The investigator an effect may touch: standing. */
export function subject(state: GameState, id: string): InvestigatorState {
  textPhase(state);
  const me = state.investigators.find((i) => i.id === id);
  if (!me) throw new Error(`no investigator ${id}`);
  if (me.defeated) throw new Error(`${id} is defeated and cannot be affected`);
  return me;
}

export const replace = (state: GameState, me: InvestigatorState): GameState => ({ ...state, investigators: state.investigators.map((i) => (i.id === me.id ? me : i)) });

export const name = ({ set }: Content, id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;

export function knownSpace(content: Content, space: string): void {
  if (!content.board.spaces.some((s) => s.id === space)) throw new Error(`no space ${space} on the board`);
}


/** The token on the board, with its sheet name. */
export function monsterOn(state: GameState, { set }: Content, monster: MonsterInstance): { token: MonsterOnBoard; label: string; epic: boolean } {
  textPhase(state);
  const sheet = set.monsters.find((m) => m.id === monster.id);
  const token = state.monsters.find((m) => m.id === monster.id && m.instance === monster.instance);
  if (!token) throw new Error(`no ${sheet?.name ?? monster.id} on the board`);
  const fighting = state.phase.name === "encounter" ? state.phase.combat?.monster : undefined;
  if (fighting && fighting.id === token.id && fighting.instance === token.instance) throw new Error("the fight is not over");
  return { token, label: `the ${sheet?.name ?? monster.id}`, epic: sheet?.epic ?? false };
}


/** A random space (manual p.4): the top clue token of the pool, discarded, names it; an empty pool takes back its discard first. */
export function randomSpace(state: GameState): { state: GameState; space: string } {
  const rebuilt = state.cluePool.length === 0 && state.clueDiscard.length > 0;
  const pool = rebuilt ? reshuffle(state, state.clueDiscard) : { items: state.cluePool, rolls: state.rolls };
  const [space, ...rest] = pool.items;
  if (space === undefined) throw new Error("no clue token is left: the lead investigator chooses the space");
  return { state: { ...state, cluePool: rest, clueDiscard: [space, ...(rebuilt ? [] : state.clueDiscard)], rolls: pool.rolls }, space };
}

export const named = (state: GameState, content: Content, space: string) => note(state, `a clue token names ${spaceName(content, space)} as the random space`);

