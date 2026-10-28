import { nearest } from "../content/board";
import type { MonsterCombat } from "../content/types";
import { advanceDoom } from "./ancientOne";
import { keepLog } from "./journal";
import { drawMythos } from "./mythos";
import type { Content } from "./setup";
import { reshuffle } from "./rng";
import { expeditionSpace } from "./setup";
import { note, spaceName } from "./spawn";
import { test } from "./test";
import { isDetained } from "./types";
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
  if (isDetained(me)) throw new Error("a Detained investigator resolves the back of Detained instead of an encounter");
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
  const target = state.monsters.find((m) => m.id === waiting.monster.id && m.instance === waiting.monster.instance);
  if (!target) throw new Error("the monster left the fight");
  const { name, combat } = combatOf(state, content, target.id);
  const { dice, successes } = waiting.roll;
  const plural = `${successes} success${successes === 1 ? "" : "es"}`;
  let s: GameState = { ...state, phase };
  if (waiting.step === "will") {
    const lost = Math.max(0, combat.will!.horror - successes);
    s = log(s, `Will test${signed(combat.will!.modifier)}: dice ${dice.join(" ")}, ${plural} against horror ${combat.will!.horror}: loses ${lost} sanity`);
    // A loss past zero leaves zero (manual p.4; combat-health-floor D1).
    s = replaceInvestigator(s, { ...me, sanity: Math.max(0, me.sanity - lost) });
    if (me.sanity - lost <= 0) return defeat(log(s, "the combat ends"), content, me.id, "sanity");
    return proceed(s, content, target, "will");
  }
  const lost = Math.max(0, combat.strength!.damage - successes);
  s = log(s, `Strength test${signed(combat.strength!.modifier)}: dice ${dice.join(" ")}, ${plural} against damage ${combat.strength!.damage}: loses ${lost} health, the ${name} loses ${successes} health`);
  s = replaceInvestigator({ ...s, monsters: s.monsters.map((m) => (m === target ? { ...m, health: m.health + successes } : m)) }, { ...me, health: Math.max(0, me.health - lost) });
  s = settle(s, content, target);
  return me.health - lost <= 0 ? defeat(s, content, me.id, "health") : s;
}

/** Defeated at its toughness and back to the cup, or it stays wounded. */
function settle(state: GameState, content: Content, monster: MonsterInstance): GameState {
  const target = state.monsters.find((m) => m.id === monster.id && m.instance === monster.instance)!;
  const { name, epic, combat } = combatOf(state, content, target.id);
  if (combat.toughness !== undefined && target.health >= combat.toughness) {
    const gone = { ...state, monsters: state.monsters.filter((m) => m !== target) };
    return log(epic ? gone : toCup(gone, [target]), `the ${name} is defeated${epic ? "" : target.setAside ? " and is set aside again" : " and returns to the cup"}`);
  }
  const stays = log(state, `the ${name} stays with ${target.health} health lost${combat.toughness === undefined ? " (toughness printed as a formula: left to the players)" : ""}`);
  return target.ambush ? log(returnAmbushers(stays), `the ${name} returns to the cup after the ambush`) : stays;
}

/** Tokens go back into the cup, which is shuffled at once from the seed (EH_reference p.11). */
export function toCup(state: GameState, tokens: (MonsterInstance & { setAside?: true })[]): GameState {
  const strip = ({ id, instance }: MonsterInstance) => ({ id, instance });
  const aside = tokens.filter((t) => t.setAside).map(strip);
  const back = tokens.filter((t) => !t.setAside).map(strip);
  const { items: monsterCup, rolls } = back.length > 0 ? reshuffle(state, [...state.monsterCup, ...back]) : { items: state.monsterCup, rolls: state.rolls };
  return { ...state, monsterCup, rolls, setAsideMonsters: [...state.setAsideMonsters, ...aside] };
}

/** Ambushing tokens were never spawned: back to the cup (manual p.3 "Ambush"). */
export function returnAmbushers(state: GameState): GameState {
  const ambushers = state.monsters.filter((m) => m.ambush);
  if (ambushers.length === 0) return state;
  return toCup({ ...state, monsters: state.monsters.filter((m) => !m.ambush) }, ambushers);
}

const signed = (n: number) => (n > 0 ? ` +${n}` : n < 0 ? ` ${n}` : "");
const investigatorName = ({ set }: Content, id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;

/** Rule words for a deck the space does not allow. */
function allowed(state: GameState, { board, set }: Content, space: string, deck: string): string | undefined {
  const at = board.spaces.find((s) => s.id === space);
  if (deck === "general") return undefined;
  if (deck === "special") return (set.ancientOnes.find((a) => a.id === state.ancientOne)?.special?.length ?? 0) > 0 ? undefined : "the Ancient One has no special encounters";
  if (deck === "research") return state.clues.includes(space) ? undefined : "a research encounter needs a clue on the space";
  if (deck === "other-world") return state.gates.includes(space) ? undefined : "an other world encounter needs a gate on the space";
  if (deck === "expedition") return state.activeExpedition === space ? undefined : "an expedition encounter needs the active expedition token on the space";
  if (deck in state.decks.encounters) return at?.region === deck ? undefined : `the ${deck} deck belongs to another region`;
  return `no encounter deck ${deck}`;
}

const OWN_DECKS = ["research", "special"] as const;
const own = (deck: string): deck is "research" | "special" => (OWN_DECKS as readonly string[]).includes(deck);
const cardsOf = (state: GameState, deck: string) => (own(deck) ? state.decks[deck] : state.decks.encounters[deck]!);
const withCards = (state: GameState, deck: string, cards: string[]): GameState => ({
  ...state,
  decks: own(deck) ? { ...state.decks, [deck]: cards } : { ...state.decks, encounters: { ...state.decks.encounters, [deck]: cards } },
});

/** The encounter on the back of a defeated investigator's sheet lying on the space (manual p.4); finishing removes the token and sheet. */
export function encounterFallen(state: GameState, content: Content, fallen: string): GameState {
  const phase = encounterPhase(state);
  const me = active(state);
  if (phase.combat) throw new Error("the fight is not over");
  if (isDetained(me)) throw new Error("a Detained investigator resolves the back of Detained instead of an encounter");
  if (monstersOn(state, me.space).length > 0) throw new Error("the monsters on the space must be fought first");
  if (phase.card) throw new Error("an investigator resolves one encounter");
  const other = state.investigators.find((i) => i.id === fallen);
  if (!other || !other.defeated || other.defeated === "devoured" || other.removed || other.space !== me.space) throw new Error(`no defeated investigator's token lies on ${spaceName(content, me.space)}`);
  return log({ ...state, phase: { ...phase, card: { deck: "fallen", id: fallen } } }, `${investigatorName(content, me.id)} resolves the back of ${investigatorName(content, fallen)}'s sheet: the text is left to the players`);
}

/** An empty deck takes its shuffled discard at once (manual p.4); the mythos deck never does. */
function replenish(state: GameState, deck: string): GameState {
  const discard = state.encounterDiscards[deck] ?? [];
  if (cardsOf(state, deck).length > 0 || discard.length === 0) return state;
  const { items, rolls } = reshuffle(state, discard);
  return { ...withCards(state, deck, items), rolls, encounterDiscards: { ...state.encounterDiscards, [deck]: [] } };
}

/** The rumor encounter on a space with a rumor token (manual p.3); the text is on the rumor card in play, and finishing discards nothing. */
export function encounterRumor(state: GameState, content: Content): GameState {
  const phase = encounterPhase(state);
  const me = active(state);
  if (phase.combat) throw new Error("the fight is not over");
  if (isDetained(me)) throw new Error("a Detained investigator resolves the back of Detained instead of an encounter");
  if (monstersOn(state, me.space).length > 0) throw new Error("the monsters on the space must be fought first");
  if (phase.card) throw new Error("an investigator resolves one encounter");
  if (!state.rumors.includes(me.space)) throw new Error(`no rumor token lies on ${spaceName(content, me.space)}`);
  return log({ ...state, phase: { ...phase, card: { deck: "rumor", id: me.space } } }, `${investigatorName(content, me.id)} resolves the rumor encounter on ${spaceName(content, me.space)}: the rumor card's text is left to the players`);
}

/** Draws the top card of an allowed deck once the space holds no monster (manual p.3), rebuilding the deck when it runs out. */
export function drawEncounter(state: GameState, content: Content, deck: string): GameState {
  const phase = encounterPhase(state);
  const me = active(state);
  if (phase.combat) throw new Error("the fight is not over");
  if (isDetained(me)) throw new Error("a Detained investigator resolves the back of Detained instead of an encounter");
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
  if (!isDetained(me) && unfought(state, me.space).length > 0) throw new Error("the monsters on the space must be fought first");
  return advance(discardDrawn(state, content), me.id);
}

/** The drawn card leaves play: to its discard, a fallen one's token and sheet out of the game; nothing when none is drawn. */
function discardDrawn(state: GameState, content: Content): GameState {
  const phase = encounterPhase(state);
  if (!phase.card || phase.card.deck === "rumor") return state;
  const { deck, id } = phase.card;
  if (deck === "fallen") return log(replaceInvestigator(state, { ...state.investigators.find((i) => i.id === id)!, removed: true }), `${investigatorName(content, id)}'s token and sheet leave the game`);
  const s: GameState = { ...state, encounterDiscards: { ...state.encounterDiscards, [deck]: [id, ...(state.encounterDiscards[deck] ?? [])] } };
  return deck === "expedition" ? { ...s, activeExpedition: expeditionSpace(content, s.decks.encounters.expedition ?? []) } : s;
}

function advance(start: GameState, after: string): GameState {
  const state = keepLog(start);
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
  const space = nearest(content.board, me.space, cities)!;
  const { items: condition, rolls } = reshuffle(state, [...state.decks.condition, ...me.conditions]);
  const fallen: InvestigatorState = { ...me, defeated: cause, space, conditions: [], improvements: {} };
  return fall({ ...state, rolls, decks: { ...state.decks, condition } }, content, fallen, `${investigatorName(content, investigator)} is defeated and lies on ${spaceName(content, space)}`);
}

/** The steps defeat and devouring share (manual p.4): doom by 1, the seat skipped, the lead passed, the loss check, the encounter passed on. */
export function fall(state: GameState, content: Content, fallen: InvestigatorState, line: string): GameState {
  // The fighter fell: the ambusher goes back and the drawn card leaves play; another seat's fall leaves the encounter as it is.
  const mine = state.phase.name === "encounter" && state.phase.active === fallen.id;
  const cleared = mine ? discardDrawn(returnAmbushers(state), content) : state;
  let s = advanceDoom(note(replaceInvestigator(cleared, fallen), line), content, 1);
  if (s.leadInvestigator === fallen.id) s = { ...s, leadInvestigator: nextStanding(s, fallen.id) ?? fallen.id };
  if (!s.investigators.some((i) => !i.defeated)) return { ...s, phase: { name: "lost", reason: `${line}: every investigator is defeated (doom ${s.doom})` } };
  // shortcut: a fall in the Action phase would leave the active seat on a fallen investigator; card text is applied in the other phases only.
  return s.phase.name === "encounter" && s.phase.active === fallen.id ? advance(s, fallen.id) : s;
}
