import { distance, neighbors } from "../content/board";
import type { Deck } from "../content/types";
import { defeat } from "./encounter";
import { reshuffle } from "./rng";
import type { Content } from "./setup";
import { note, spaceName, textPhase } from "./spawn";
import { isDetained } from "./types";
import type { GameState, InvestigatorState, MonsterInstance, MonsterOnBoard } from "./types";

/** Card text applied by the players (manual_eng.pdf p.3–4): health, sanity, clues, gates and cards. The text itself stays with the players. */

const DOUBLE_SIDED: Deck[] = ["spell", "condition", "unique-asset"];

/** The investigator an effect may touch: standing. */
function subject(state: GameState, id: string): InvestigatorState {
  textPhase(state);
  const me = state.investigators.find((i) => i.id === id);
  if (!me) throw new Error(`no investigator ${id}`);
  if (me.defeated) throw new Error(`${id} is defeated and cannot be affected`);
  return me;
}

const replace = (state: GameState, me: InvestigatorState): GameState => ({ ...state, investigators: state.investigators.map((i) => (i.id === me.id ? me : i)) });
const name = ({ set }: Content, id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;

/** Gains stop at the sheet maximum; a loss to 0 defeats (manual p.4). Deviation: effects that prevent a loss are left to the players. */
function change(state: GameState, content: Content, id: string, stat: "health" | "sanity", delta: number): GameState {
  const me = subject(state, id);
  const value = Math.min(content.set.investigators.find((i) => i.id === id)![stat], me[stat] + delta);
  const s = note(replace(state, { ...me, [stat]: value }), `${name(content, id)} ${delta < 0 ? "loses" : "gains"} ${Math.abs(delta)} ${stat}`);
  return value <= 0 ? defeat(s, content, id, stat) : s;
}
export const changeHealth = (state: GameState, content: Content, id: string, delta: number) => change(state, content, id, "health", delta);
export const changeSanity = (state: GameState, content: Content, id: string, delta: number) => change(state, content, id, "sanity", delta);

/** Card text moves the pawn anywhere, with no ticket or action (manual p.3–4); which space is "nearest" or "random" is the players' call. */
export function moveInvestigator(state: GameState, content: Content, id: string, space: string): GameState {
  const me = subject(state, id);
  if (isDetained(me)) throw new Error("a Detained investigator cannot move");
  if (!content.board.spaces.some((s) => s.id === space)) throw new Error(`no space ${space} on the board`);
  return note(replace(state, { ...me, space }), `${name(content, id)} moves to ${spaceName(content, space)}`);
}

/** Lays the token on its side (manual p.4 "Delayed"). Deviation: text that ends the delay early is left to the players. */
export function delay(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (me.delayed) throw new Error(`${name(content, id)} is already delayed`);
  return note(replace(state, { ...me, delayed: true }), `${name(content, id)} is delayed`);
}

/** The clue token on the space, else the top of the pool with the discard reshuffled in first (manual p.4). */
export function gainClue(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  const held = replace(state, { ...me, clues: me.clues + 1 });
  if (state.clues.includes(me.space)) return note({ ...held, clues: state.clues.filter((s) => s !== me.space) }, `${name(content, id)} gains the clue on ${spaceName(content, me.space)}`);
  const pool = state.cluePool.length === 0 && state.clueDiscard.length > 0 ? reshuffle(state, state.clueDiscard) : { items: state.cluePool, rolls: state.rolls };
  if (pool.items.length === 0) throw new Error("no clue can be gained: the pool and discard are empty");
  return note({ ...held, cluePool: pool.items.slice(1), clueDiscard: [], rolls: pool.rolls }, `${name(content, id)} gains 1 clue from the pool`);
}

/** Deviation: a spent clue leaves the game; the pool only tracks tokens on the board. */
export function spendClue(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (me.clues === 0) throw new Error(`${name(content, id)} holds no clue`);
  return note(replace(state, { ...me, clues: me.clues - 1 }), `${name(content, id)} spends 1 clue`);
}

/** The gate token on the space goes to the gate discard; monsters stay (manual p.4). */
export function closeGate(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (!state.gates.includes(me.space)) throw new Error(`no gate stands on ${spaceName(content, me.space)}`);
  return note({ ...replace(state, me), gates: state.gates.filter((s) => s !== me.space), gateDiscard: [me.space, ...state.gateDiscard] }, `${name(content, id)} closes the gate on ${spaceName(content, me.space)}`);
}

/** An empty asset or artifact deck takes its shuffled discard at once (manual p.4). */
function replenish(state: GameState, deck: Deck): GameState {
  const pile = deck === "asset" ? "assetDiscard" : deck === "artifact" ? "artifactDiscard" : undefined;
  if (pile === undefined || state.decks[deck].length > 0 || state[pile].length === 0) return state;
  const { items, rolls } = reshuffle(state, state[pile]);
  return { ...state, rolls, decks: { ...state.decks, [deck]: items }, [pile]: [] };
}

/** By name when given; else the top card, or the bottom of a double-sided deck (manual p.4). Spells and conditions are never duplicated. */
export function gainCard(start: GameState, content: Content, id: string, deck: Deck, cardName?: string): GameState {
  const me = subject(start, id);
  const state = replenish(start, deck);
  const cards = state.decks[deck];
  const title = (cardId: string) => content.set.cards.find((c) => c.id === cardId)?.name;
  const at = cardName === undefined ? (DOUBLE_SIDED.includes(deck) ? cards.length - 1 : 0) : cards.findIndex((c) => title(c) === cardName);
  const card = cards[at];
  if (card === undefined) throw new Error(cardName === undefined ? `the ${deck} deck is empty` : `no ${cardName} in the ${deck} deck`);
  const gained = title(card)!;
  if (DOUBLE_SIDED.includes(deck) && [...me.possessions, ...me.conditions].some((c) => title(c) === gained)) throw new Error(`${name(content, id)} already has ${gained}`);
  const held = deck === "condition" ? { ...me, conditions: [...me.conditions, card] } : { ...me, possessions: [...me.possessions, card] };
  return note({ ...replace(state, held), decks: { ...state.decks, [deck]: cards.filter((_, n) => n !== at) } }, `${name(content, id)} gains ${gained}`);
}

/** Assets and artifacts go to their discard; a double-sided card is shuffled back into its deck at once (manual p.4). */
export function discardCard(state: GameState, content: Content, id: string, cardId: string): GameState {
  const me = subject(state, id);
  const card = content.set.cards.find((c) => c.id === cardId);
  if (!card || !(me.possessions.includes(cardId) || me.conditions.includes(cardId))) throw new Error(`${name(content, id)} does not hold ${cardId}`);
  let s = replace(state, { ...me, possessions: me.possessions.filter((c) => c !== cardId), conditions: me.conditions.filter((c) => c !== cardId) });
  if (card.deck === "asset") s = { ...s, assetDiscard: [cardId, ...s.assetDiscard] };
  else if (card.deck === "artifact") s = { ...s, artifactDiscard: [cardId, ...s.artifactDiscard] };
  else {
    const { items, rolls } = reshuffle(s, [...s.decks[card.deck], cardId]);
    s = { ...s, decks: { ...s.decks, [card.deck]: items }, rolls };
  }
  return note(s, `${name(content, id)} discards ${card.name}`);
}

/** The token on the board, with its sheet name. */
function monsterOn(state: GameState, { set }: Content, monster: MonsterInstance): { token: MonsterOnBoard; label: string; epic: boolean } {
  textPhase(state);
  const sheet = set.monsters.find((m) => m.id === monster.id);
  const token = state.monsters.find((m) => m.id === monster.id && m.instance === monster.instance);
  if (!token) throw new Error(`no ${sheet?.name ?? monster.id} on the board`);
  return { token, label: `the ${sheet?.name ?? monster.id}`, epic: sheet?.epic ?? false };
}

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
  return epic
    ? note(left, `${label} is discarded and leaves the game`)
    : note({ ...left, monsterCup: [...left.monsterCup, { id: token.id, instance: token.instance }] }, `${label} is discarded and returns to the cup`);
}
