import { distance } from "../content/board";
import type { MonsterCombat } from "../content/types";
import { awakenAt0 } from "./ancientOne";
import { drawMythos } from "./mythos";
import type { Content } from "./setup";
import { reshuffle } from "./rng";
import { expeditionSpace } from "./setup";
import { note, spaceName } from "./spawn";
import { test } from "./test";
import type { EncounterPhase, GameState, InvestigatorState, MonsterInstance } from "./types";

/** Encounter phase (manual_eng.pdf p.3–4, p.8; EH_reference.pdf p.2, p.5, p.8): fight the monsters on the space, or draw one encounter card. */

/** Standing investigators in turn order: the lead first, then clockwise. */
function turnOrder(state: GameState): string[] {
  const ids = state.investigators.filter((i) => !i.defeated).map((i) => i.id);
  const lead = ids.indexOf(state.leadInvestigator);
  return lead < 0 ? ids : [...ids.slice(lead), ...ids.slice(0, lead)];
}

/** The standing seat after `active` this round, or undefined after the last. */
export function nextStanding(state: GameState, active: string): string | undefined {
  const order = turnOrder(state);
  return order[order.indexOf(active) + 1];
}

/** Opens the Encounter phase with the lead investigator. */
export function startEncounters(state: GameState): GameState {
  const active = turnOrder(state)[0];
  if (active === undefined) throw new Error("no investigator is standing");
  return { ...state, phase: { name: "encounter", active, log: [], fought: [] } };
}

function encounterPhase(state: GameState): EncounterPhase {
  if (state.phase.name !== "encounter") throw new Error("encounters are resolved in the Encounter phase only");
  return state.phase;
}

function active(state: GameState): InvestigatorState {
  return state.investigators.find((i) => i.id === encounterPhase(state).active)!;
}

function log(state: GameState, line: string): GameState {
  const phase = encounterPhase(state);
  return { ...state, phase: { ...phase, log: [...phase.log, line] } };
}

const monstersOn = (state: GameState, space: string) => state.monsters.filter((m) => m.space === space);
export const monsterKey = (m: MonsterInstance) => `${m.id}#${m.instance}`;
/** Monsters on the active investigator's space not yet fought this encounter. */
const unfought = (state: GameState, space: string) => monstersOn(state, space).filter((m) => !encounterPhase(state).fought.includes(monsterKey(m)));

function replaceInvestigator(state: GameState, next: InvestigatorState): GameState {
  return { ...state, investigators: state.investigators.map((i) => (i.id === next.id ? next : i)) };
}

/** The token back, or the Ancient One's Cultist row. */
function combatOf(state: GameState, { set }: Content, id: string): { name: string; epic: boolean; combat: MonsterCombat } {
  const sheet = set.monsters.find((m) => m.id === id);
  if (!sheet) throw new Error(`unknown monster ${id}`);
  const combat = sheet.combat.onAncientOneSheet ? set.ancientOnes.find((a) => a.id === state.ancientOne)!.cultists : sheet.combat;
  return { name: sheet.name, epic: sheet.epic ?? false, combat };
}

/**
 * One combat encounter (manual p.8), in steps so clues can reroll: the Will test waits; continuing takes sanity by which the horror exceeds
 * the successes and rolls the Strength test, which waits; continuing takes health by which the damage exceeds the successes while the
 * monster loses health equal to them; at its toughness the monster is defeated. A test the token does not print is skipped.
 * Deviation: token text is left to the players; a toughness formula never defeats.
 */
export function fight(state: GameState, content: Content, monster: MonsterInstance): GameState {
  const me = active(state);
  const target = state.monsters.find((m) => m.id === monster.id && m.instance === monster.instance);
  if (!target || target.space !== me.space) throw new Error("combat is against monsters on the investigator's space");
  const phase = encounterPhase(state);
  if (phase.combat) throw new Error("the fight is not over");
  if (phase.fought.includes(monsterKey(target))) throw new Error("each monster is fought once per encounter");
  const { name, epic } = combatOf(state, content, target.id);
  if (epic && monstersOn(state, me.space).some((m) => !combatOf(state, content, m.id).epic)) throw new Error("every non-epic monster is fought before an epic one");
  const s = log({ ...state, phase: { ...phase, fought: [...phase.fought, monsterKey(target)] } }, `${investigatorName(content, me.id)} fights the ${name}`);
  return proceed(s, content, target, undefined);
}

/** Rolls the next printed test and waits, or settles the fight after the last one. */
function proceed(state: GameState, content: Content, target: MonsterInstance, done: "will" | "strength" | undefined): GameState {
  const { combat } = combatOf(state, content, target.id);
  let s = state;
  if (done === undefined) {
    if (combat.will) return wait(s, content, target, "will", combat.will.modifier);
    s = log(s, "the token prints no Will test");
  }
  if (done !== "strength") {
    if (combat.strength) return wait(s, content, target, "strength", combat.strength.modifier);
    s = log(s, "the token prints no Strength test");
  }
  return settle(s, content, target);
}

function wait(state: GameState, content: Content, target: MonsterInstance, step: "will" | "strength", modifier: number): GameState {
  const { state: s, ...roll } = test(state, content.set, active(state).id, step, modifier);
  return { ...s, phase: { ...encounterPhase(s), combat: { monster: { id: target.id, instance: target.instance }, step, roll } } };
}

/** Takes the waiting roll's result: the loss, the monster's wound, then the next step (manual p.8). */
export function continueFight(state: GameState, content: Content): GameState {
  const { combat: waiting, ...phase } = encounterPhase(state);
  if (!waiting) throw new Error("no fight is waiting");
  const me = active(state);
  const target = state.monsters.find((m) => m.id === waiting.monster.id && m.instance === waiting.monster.instance)!;
  const { name, combat } = combatOf(state, content, target.id);
  const { dice, successes } = waiting.roll;
  const plural = `${successes} success${successes === 1 ? "" : "es"}`;
  let s: GameState = { ...state, phase };
  if (waiting.step === "will") {
    const lost = Math.max(0, combat.will!.horror - successes);
    s = log(s, `Will test${signed(combat.will!.modifier)}: dice ${dice.join(" ")}, ${plural} against horror ${combat.will!.horror}: loses ${lost} sanity`);
    s = replaceInvestigator(s, { ...me, sanity: me.sanity - lost });
    if (me.sanity - lost <= 0) return defeat(log(s, "the combat ends"), content, me.id, "sanity");
    return proceed(s, content, target, "will");
  }
  const lost = Math.max(0, combat.strength!.damage - successes);
  s = log(s, `Strength test${signed(combat.strength!.modifier)}: dice ${dice.join(" ")}, ${plural} against damage ${combat.strength!.damage}: loses ${lost} health, the ${name} loses ${successes} health`);
  s = replaceInvestigator({ ...s, monsters: s.monsters.map((m) => (m === target ? { ...m, health: m.health + successes } : m)) }, { ...me, health: me.health - lost });
  s = settle(s, content, target);
  return me.health - lost <= 0 ? defeat(s, content, me.id, "health") : s;
}

/** Defeated at its toughness and back to the cup, or it stays wounded. */
function settle(state: GameState, content: Content, monster: MonsterInstance): GameState {
  const target = state.monsters.find((m) => m.id === monster.id && m.instance === monster.instance)!;
  const { name, epic, combat } = combatOf(state, content, target.id);
  if (combat.toughness !== undefined && target.health >= combat.toughness) {
    return log({ ...state, monsters: state.monsters.filter((m) => m !== target), monsterCup: epic ? state.monsterCup : [...state.monsterCup, { id: target.id, instance: target.instance }] }, `the ${name} is defeated${epic ? "" : " and returns to the cup"}`);
  }
  return log(state, `the ${name} stays with ${target.health} health lost${combat.toughness === undefined ? " (toughness printed as a formula: left to the players)" : ""}`);
}

const signed = (n: number) => (n > 0 ? ` +${n}` : n < 0 ? ` ${n}` : "");
const investigatorName = ({ set }: Content, id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;

/** Rule words for a deck the space does not allow. */
function allowed(state: GameState, { board }: Content, space: string, deck: string): string | undefined {
  const at = board.spaces.find((s) => s.id === space);
  if (deck === "general") return undefined;
  if (deck === "research") return state.clues.includes(space) ? undefined : "a research encounter needs a clue on the space";
  if (deck === "other-world") return state.gates.includes(space) ? undefined : "an other world encounter needs a gate on the space";
  if (deck === "expedition") return state.activeExpedition === space ? undefined : "an expedition encounter needs the active expedition token on the space";
  if (deck in state.decks.encounters) return at?.region === deck ? undefined : `the ${deck} deck belongs to another region`;
  return `no encounter deck ${deck}`;
}

const cardsOf = (state: GameState, deck: string) => (deck === "research" ? state.decks.research : state.decks.encounters[deck]!);
const withCards = (state: GameState, deck: string, cards: string[]): GameState => ({
  ...state,
  decks: deck === "research" ? { ...state.decks, research: cards } : { ...state.decks, encounters: { ...state.decks.encounters, [deck]: cards } },
});

/** An empty deck takes its shuffled discard at once (manual p.4); the mythos deck never does. */
function replenish(state: GameState, deck: string): GameState {
  const discard = state.encounterDiscards[deck] ?? [];
  if (cardsOf(state, deck).length > 0 || discard.length === 0) return state;
  const { items, rolls } = reshuffle(state, discard);
  return { ...withCards(state, deck, items), rolls, encounterDiscards: { ...state.encounterDiscards, [deck]: [] } };
}

/** Draws the top card of an allowed deck once the space holds no monster (manual p.3), rebuilding the deck when it runs out. */
export function drawEncounter(state: GameState, content: Content, deck: string): GameState {
  const phase = encounterPhase(state);
  const me = active(state);
  if (phase.combat) throw new Error("the fight is not over");
  if (monstersOn(state, me.space).length > 0) throw new Error("the monsters on the space must be fought first");
  if (phase.card) throw new Error("an investigator resolves one encounter");
  const refusal = allowed(state, content, me.space, deck);
  if (refusal) throw new Error(refusal);
  const full = replenish(state, deck);
  const [card, ...rest] = cardsOf(full, deck);
  if (card === undefined) throw new Error(`the ${deck} deck and its discard are empty`);
  const drawn = replenish(withCards(full, deck, rest), deck);
  return log({ ...drawn, phase: { ...phase, card: { deck, id: card } } }, `draws from the ${deck} deck: the card text is left to the players`);
}

/** Discards the drawn card and passes to the next seat once every monster on the space was fought; after the last the Mythos phase draws its card. */
export function finishEncounter(state: GameState, content: Content): GameState {
  const phase = encounterPhase(state);
  const me = active(state);
  if (phase.combat) throw new Error("the fight is not over");
  if (unfought(state, me.space).length > 0) throw new Error("the monsters on the space must be fought first");
  let s = state;
  if (phase.card) {
    const { deck, id } = phase.card;
    s = { ...s, encounterDiscards: { ...s.encounterDiscards, [deck]: [id, ...(s.encounterDiscards[deck] ?? [])] } };
    if (deck === "expedition") s = { ...s, activeExpedition: expeditionSpace(content, s.decks.encounters.expedition ?? []) };
  }
  return advance(s, me.id);
}

function advance(state: GameState, after: string): GameState {
  const next = nextStanding(state, after);
  return next === undefined ? drawMythos(state) : { ...state, phase: { name: "encounter", active: next, log: [], fought: [] } };
}

/**
 * Defeat at 0 health or sanity (manual p.4): doom advances by 1, the pawn lies in the nearest city, conditions return to their deck,
 * the seat is skipped from now on, the lead passes when needed; with nobody standing the game is lost.
 * Deviation: the first of several nearest cities in board order is taken, and nobody replaces the investigator.
 */
export function defeat(state: GameState, content: Content, investigator: string, cause: "health" | "sanity"): GameState {
  const me = state.investigators.find((i) => i.id === investigator);
  if (!me) throw new Error(`no investigator ${investigator}`);
  const cities = content.board.spaces.filter((sp) => sp.kind === "city").map((sp) => sp.id);
  const space = cities.reduce((best, id) => (distance(content.board, me.space, id) < distance(content.board, me.space, best) ? id : best));
  const { items: condition, rolls } = reshuffle(state, [...state.decks.condition, ...me.conditions]);
  const fallen = { ...me, defeated: cause, space, conditions: [] };
  let s = awakenAt0(note(replaceInvestigator({ ...state, doom: state.doom - 1, rolls, decks: { ...state.decks, condition } }, fallen), `${investigatorName(content, investigator)} is defeated and lies on ${spaceName(content, space)}`), content);
  if (s.leadInvestigator === investigator) s = { ...s, leadInvestigator: nextStanding(s, investigator) ?? investigator };
  if (!s.investigators.some((i) => !i.defeated)) return { ...s, phase: { name: "lost", reason: `every investigator is defeated (doom ${s.doom})` } };
  // shortcut: defeat is only reached from combat today; a defeat in the Action phase would leave the active seat on a fallen investigator, upgrade when encounter text is applied by hand.
  return s.phase.name === "encounter" && s.phase.active === investigator ? advance(s, investigator) : s;
}
