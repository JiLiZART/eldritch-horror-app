import { nearestAll } from "../../content/board";
import type { Skill, SpaceKind } from "../../content/types";
import { defeat, fall } from "../encounter";
import { reshuffle } from "../rng";
import type { Content } from "../setup";
import { note, spaceName, spendHeldClue } from "../spawn";
import { isDetained } from "../types";
import type { GameState, InvestigatorState } from "../types";
import { name, named, randomSpace, replace, subject } from "./shared";

/** Card text on an investigator (manual_eng.pdf p.3–4): health, sanity, clues, delay, skills, movement, devouring. */

/** Gains stop at the sheet maximum; a loss to 0 defeats (manual p.4). Deviation: effects that prevent a loss are left to the players. */
function change(state: GameState, content: Content, id: string, stat: "health" | "sanity", delta: number): GameState {
  const me = subject(state, id);
  const value = Math.min(content.set.investigators.find((i) => i.id === id)![stat], me[stat] + delta);
  const s = note(replace(state, { ...me, [stat]: value }), `${name(content, id)} ${delta < 0 ? "loses" : "gains"} ${Math.abs(delta)} ${stat}`);
  return value <= 0 ? defeat(s, content, id, stat) : s;
}

export const changeHealth = (state: GameState, content: Content, id: string, delta: number) => change(state, content, id, "health", delta);

export const changeSanity = (state: GameState, content: Content, id: string, delta: number) => change(state, content, id, "sanity", delta);

/** A card's cost in health or sanity (manual p.4; EH_reference p.12 "Тратить"): never the last point. */
function spend(state: GameState, content: Content, id: string, stat: "health" | "sanity", amount: number): GameState {
  const me = subject(state, id);
  if (me[stat] - amount <= 0) throw new Error(`${name(content, id)} cannot spend their last ${stat}`);
  return note(replace(state, { ...me, [stat]: me[stat] - amount }), `${name(content, id)} spends ${amount} ${stat}`);
}

export const spendHealth = (state: GameState, content: Content, id: string, amount: number) => spend(state, content, id, "health", amount);
export const spendSanity = (state: GameState, content: Content, id: string, amount: number) => spend(state, content, id, "sanity", amount);

/** Card text moves the pawn anywhere, with no ticket or action (manual p.3–4); which space is "nearest" or "random" is the players' call. */
export function moveInvestigator(state: GameState, content: Content, id: string, space: string): GameState {
  const me = subject(state, id);
  if (isDetained(me)) throw new Error("a Detained investigator cannot move");
  if (!content.board.spaces.some((s) => s.id === space)) throw new Error(`no space ${space} on the board`);
  return note(replace(state, { ...me, space }), `${name(content, id)} moves to ${spaceName(content, space)}`);
}

export type NearestTarget = SpaceKind | "gate" | "clue";

/** "Move to the nearest X" (EH_reference p.2): the fewest paths, the own space first when it matches. Deviation: ties go to board order. */
/** The nearest spaces of a kind from the investigator's space, every one on a tie (nearest-choice D1). */
export function nearestSpaces(state: GameState, content: Content, id: string, target: NearestTarget): string[] {
  const me = subject(state, id);
  const ids = content.board.spaces.map((s) => s.id);
  const candidates = target === "gate" ? ids.filter((s) => state.gates.includes(s)) : target === "clue" ? ids.filter((s) => state.clues.includes(s)) : content.board.spaces.filter((s) => s.kind === target).map((s) => s.id);
  return nearestAll(content.board, me.space, candidates);
}

/** Among several nearest spaces the players choose, as the active investigator does at the table (EH_reference p.2; nearest-choice D2). */
export function moveInvestigatorToNearest(state: GameState, content: Content, id: string, target: NearestTarget, chosen?: string): GameState {
  const me = subject(state, id);
  const what = target === "gate" || target === "clue" ? `space with a ${target}` : `${target} space`;
  const nearest = nearestSpaces(state, content, id, target);
  if (nearest.length === 0) throw new Error(`no ${what} exists`);
  const space = nearest.length === 1 ? nearest[0]! : chosen && nearest.includes(chosen) ? chosen : undefined;
  if (space === undefined) throw new Error(`choose among the nearest ${what}s: ${nearest.map((s) => spaceName(content, s)).join(", ")}`);
  if (space === me.space) return note(state, `${name(content, id)} is already on the nearest ${target === "gate" || target === "clue" ? what : target}`);
  return moveInvestigator(state, content, id, space);
}


/** Card text ends a delay early (manual p.4 "Delayed"). */
export function standUp(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (!me.delayed) throw new Error(`${name(content, id)} is not delayed`);
  return note(replace(state, { ...me, delayed: undefined }), `${name(content, id)} stands up`);
}


/** Lays the token on its side (manual p.4 "Delayed"). Deviation: text that ends the delay early is left to the players. */
export function delay(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (me.delayed) throw new Error(`${name(content, id)} is already delayed`);
  return note(replace(state, { ...me, delayed: true }), `${name(content, id)} is delayed`);
}

const SKILL_NAMES: Record<Skill, string> = { lore: "Lore", influence: "Influence", observation: "Observation", strength: "Strength", will: "Will" };

/** +1, then flipped to +2; at most twice per game (EH_reference p.13). Deviation: impairment tokens are not modelled. */
export function improveSkill(state: GameState, content: Content, id: string, skill: Skill): GameState {
  const me = subject(state, id);
  const level = me.improvements[skill] ?? 0;
  if (level >= 2) throw new Error(`${SKILL_NAMES[skill]} is improved at most twice`);
  const next = (level + 1) as 1 | 2;
  return note(replace(state, { ...me, improvements: { ...me.improvements, [skill]: next } }), `${name(content, id)} improves ${SKILL_NAMES[skill]} to +${next}`);
}


/** Card text takes the token one step back. */
export function discardImprovement(state: GameState, content: Content, id: string, skill: Skill): GameState {
  const me = subject(state, id);
  const level = me.improvements[skill] ?? 0;
  if (level === 0) throw new Error(`${SKILL_NAMES[skill]} is not improved`);
  const { [skill]: _, ...rest } = me.improvements;
  const improvements = level === 2 ? { ...rest, [skill]: 1 as const } : rest;
  return note(replace(state, { ...me, improvements }), `${name(content, id)} discards a ${SKILL_NAMES[skill]} improvement`);
}


/** The clue token on the space, else the top of the pool with the discard reshuffled in first (manual p.4). */
export function gainClue(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  const held = replace(state, { ...me, clues: me.clues + 1 });
  if (state.clues.includes(me.space)) return note({ ...held, clues: state.clues.filter((s) => s !== me.space), heldClues: [...state.heldClues, me.space] }, `${name(content, id)} gains the clue on ${spaceName(content, me.space)}`);
  const rebuilt = state.cluePool.length === 0 && state.clueDiscard.length > 0;
  const pool = rebuilt ? reshuffle(state, state.clueDiscard) : { items: state.cluePool, rolls: state.rolls };
  const [token, ...rest] = pool.items;
  if (token === undefined) throw new Error("no clue can be gained: the pool and discard are empty");
  return note({ ...held, cluePool: rest, clueDiscard: rebuilt ? [] : state.clueDiscard, heldClues: [...state.heldClues, token], rolls: pool.rolls }, `${name(content, id)} gains 1 clue from the pool`);
}


/** Deviation: a spent clue leaves the game; the pool only tracks tokens on the board. */
export function spendClue(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (me.clues === 0) throw new Error(`${name(content, id)} holds no clue`);
  return note(replace(spendHeldClue(state), { ...me, clues: me.clues - 1 }), `${name(content, id)} spends 1 clue`);
}


/** "You are devoured" (manual p.4): doom by 1, everything held discarded, the sheet and token back to the box; a new sheet at the end of the Mythos phase. */
export function devour(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  const piles = { assetDiscard: [...state.assetDiscard], artifactDiscard: [...state.artifactDiscard], spell: [...state.decks.spell], condition: [...state.decks.condition], "unique-asset": [...state.decks["unique-asset"]] };
  for (const cardId of [...me.possessions, ...me.conditions]) {
    const deck = content.set.cards.find((c) => c.id === cardId)?.deck;
    if (deck === "asset") piles.assetDiscard.push(cardId);
    else if (deck === "artifact") piles.artifactDiscard.push(cardId);
    else if (deck) piles[deck].push(cardId);
  }
  const { items: spell, rolls: r1 } = reshuffle(state, piles.spell);
  const { items: condition, rolls: r2 } = reshuffle({ ...state, rolls: r1 }, piles.condition);
  let s: GameState = { ...state, rolls: r2, assetDiscard: piles.assetDiscard, artifactDiscard: piles.artifactDiscard, decks: { ...state.decks, spell, condition, "unique-asset": piles["unique-asset"] } };
  for (let n = 0; n < me.clues; n++) s = spendHeldClue(s);
  const gone: InvestigatorState = { ...me, defeated: "devoured", possessions: [], conditions: [], clues: 0, tickets: [], improvements: {}, delayed: undefined };
  return fall(s, content, gone, `${name(content, id)} is devoured`);
}


/** "Move to a random space" by card text. */
export function moveInvestigatorRandomly(state: GameState, content: Content, id: string): GameState {
  subject(state, id);
  const drawn = randomSpace(state);
  return moveInvestigator(named(drawn.state, content, drawn.space), content, id, drawn.space);
}

