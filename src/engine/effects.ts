import { distance, nearest, neighbors } from "../content/board";
import type { Deck, Skill, SpaceKind } from "../content/types";
import { defeat, fall, fight, toCup } from "./encounter";
import { OMEN_TRACK } from "./omen";
import { reshuffle, rng } from "./rng";
import type { Content } from "./setup";
import { note, spaceName, spawnClue, spawnGate, spawnMonster, spendHeldClue, textPhase } from "./spawn";
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

export type NearestTarget = SpaceKind | "gate" | "clue";

/** "Move to the nearest X" (EH_reference p.2): the fewest paths, the own space first when it matches. Deviation: ties go to board order. */
export function moveInvestigatorToNearest(state: GameState, content: Content, id: string, target: NearestTarget): GameState {
  const me = subject(state, id);
  const ids = content.board.spaces.map((s) => s.id);
  const candidates = target === "gate" ? ids.filter((s) => state.gates.includes(s)) : target === "clue" ? ids.filter((s) => state.clues.includes(s)) : content.board.spaces.filter((s) => s.kind === target).map((s) => s.id);
  const what = target === "gate" || target === "clue" ? `space with a ${target}` : `${target} space`;
  const space = nearest(content.board, me.space, candidates);
  if (space === undefined) throw new Error(`no ${what} exists`);
  if (space === me.space) return note(state, `${name(content, id)} is already on the nearest ${target === "gate" || target === "clue" ? what : target}`);
  return moveInvestigator(state, content, id, space);
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
  const pool = state.cluePool.length === 0 && state.clueDiscard.length > 0 ? reshuffle(state, state.clueDiscard) : { items: state.cluePool, rolls: state.rolls };
  const [token, ...rest] = pool.items;
  if (token === undefined) throw new Error("no clue can be gained: the pool and discard are empty");
  return note({ ...held, cluePool: rest, clueDiscard: [], heldClues: [...state.heldClues, token], rolls: pool.rolls }, `${name(content, id)} gains 1 clue from the pool`);
}

/** Deviation: a spent clue leaves the game; the pool only tracks tokens on the board. */
export function spendClue(state: GameState, content: Content, id: string): GameState {
  const me = subject(state, id);
  if (me.clues === 0) throw new Error(`${name(content, id)} holds no clue`);
  return note(replace(spendHeldClue(state), { ...me, clues: me.clues - 1 }), `${name(content, id)} spends 1 clue`);
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
  return epic ? note(left, `${label} is discarded and leaves the game`) : note(toCup(left, [token]), `${label} is discarded and ${token.setAside ? "is set aside again" : "returns to the cup"}`);
}

export type BoardToken = "rumor" | "eldritch";

function knownSpace(content: Content, space: string): void {
  if (!content.board.spaces.some((s) => s.id === space)) throw new Error(`no space ${space} on the board`);
}

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

/** A random space (manual p.4): the top clue token of the pool, discarded, names it; an empty pool takes back its discard first. */
function randomSpace(state: GameState): { state: GameState; space: string } {
  const rebuilt = state.cluePool.length === 0 && state.clueDiscard.length > 0;
  const pool = rebuilt ? reshuffle(state, state.clueDiscard) : { items: state.cluePool, rolls: state.rolls };
  const [space, ...rest] = pool.items;
  if (space === undefined) throw new Error("no clue token is left: the lead investigator chooses the space");
  return { state: { ...state, cluePool: rest, clueDiscard: [space, ...(rebuilt ? [] : state.clueDiscard)], rolls: pool.rolls }, space };
}

const named = (state: GameState, content: Content, space: string) => note(state, `a clue token names ${spaceName(content, space)} as the random space`);

/** "Move to a random space" by card text. */
export function moveInvestigatorRandomly(state: GameState, content: Content, id: string): GameState {
  subject(state, id);
  const drawn = randomSpace(state);
  return moveInvestigator(named(drawn.state, content, drawn.space), content, id, drawn.space);
}

/** "Spawn 1 Monster on a random space" by card text. */
export function spawnMonsterRandomly(state: GameState, content: Content, id: string): GameState {
  subject(state, id);
  const drawn = randomSpace(state);
  return spawnMonsterByText(named(drawn.state, content, drawn.space), content, id, drawn.space);
}
