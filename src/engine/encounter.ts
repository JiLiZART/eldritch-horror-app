import type { MonsterCombat } from "../content/types";
import { drawMythos } from "./mythos";
import type { Content } from "./setup";
import { expeditionSpace } from "./setup";
import { test } from "./test";
import type { EncounterPhase, GameState, InvestigatorState, MonsterInstance, MonsterOnBoard } from "./types";

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
 * One combat encounter (manual p.8): Will test, lose sanity by which the horror exceeds the successes; Strength test, lose health
 * by which the damage exceeds the successes while the monster loses health equal to them; at its toughness the monster is defeated.
 * A test the token does not print is skipped. Deviation: token text is left to the players; a toughness formula never defeats.
 */
export function fight(state: GameState, content: Content, monster: MonsterInstance): GameState {
  const me = active(state);
  const target = state.monsters.find((m) => m.id === monster.id && m.instance === monster.instance);
  if (!target || target.space !== me.space) throw new Error("combat is against monsters on the investigator's space");
  const phase = encounterPhase(state);
  if (phase.fought.includes(monsterKey(target))) throw new Error("each monster is fought once per encounter");
  const { name, epic, combat } = combatOf(state, content, target.id);
  if (epic && monstersOn(state, me.space).some((m) => !combatOf(state, content, m.id).epic)) throw new Error("every non-epic monster is fought before an epic one");
  let s = log({ ...state, phase: { ...phase, fought: [...phase.fought, monsterKey(target)] } }, `${investigatorName(content, me.id)} fights the ${name}`);
  const plural = (n: number) => `${n} success${n === 1 ? "" : "es"}`;
  const roll = (skill: "will" | "strength", modifier: number) => {
    const r = test(s, content.set, me.id, skill, modifier);
    s = r.state;
    return r;
  };
  let hurt = { ...me };
  if (combat.will) {
    const { dice, successes } = roll("will", combat.will.modifier);
    const lost = Math.max(0, combat.will.horror - successes);
    hurt = { ...hurt, sanity: hurt.sanity - lost };
    s = log(s, `Will test${signed(combat.will.modifier)}: dice ${dice.join(" ")}, ${plural(successes)} against horror ${combat.will.horror}: loses ${lost} sanity`);
    s = replaceInvestigator(s, hurt);
    if (hurt.sanity <= 0) return defeat(log(s, "the combat ends"), me.id, "sanity");
  } else s = log(s, "the token prints no Will test");
  let wounded: MonsterOnBoard = target;
  if (combat.strength) {
    const { dice, successes } = roll("strength", combat.strength.modifier);
    const lost = Math.max(0, combat.strength.damage - successes);
    hurt = { ...hurt, health: hurt.health - lost };
    wounded = { ...target, health: target.health + successes };
    s = log(s, `Strength test${signed(combat.strength.modifier)}: dice ${dice.join(" ")}, ${plural(successes)} against damage ${combat.strength.damage}: loses ${lost} health, the ${name} loses ${successes} health`);
    s = replaceInvestigator(s, hurt);
  } else s = log(s, "the token prints no Strength test");
  if (combat.toughness !== undefined && wounded.health >= combat.toughness) {
    s = log({ ...s, monsters: s.monsters.filter((m) => m !== target), monsterCup: epic ? s.monsterCup : [...s.monsterCup, { id: target.id, instance: target.instance }] }, `the ${name} is defeated${epic ? "" : " and returns to the cup"}`);
  } else {
    s = log({ ...s, monsters: s.monsters.map((m) => (m === target ? wounded : m)) }, `the ${name} stays with ${wounded.health} health lost${combat.toughness === undefined ? " (toughness printed as a formula: left to the players)" : ""}`);
  }
  return hurt.health <= 0 ? defeat(s, me.id, "health") : s;
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

/** Draws the top card of an allowed deck once the space holds no monster (manual p.3). */
export function drawEncounter(state: GameState, content: Content, deck: string): GameState {
  const phase = encounterPhase(state);
  const me = active(state);
  if (monstersOn(state, me.space).length > 0) throw new Error("the monsters on the space must be fought first");
  if (phase.card) throw new Error("an investigator resolves one encounter");
  const refusal = allowed(state, content, me.space, deck);
  if (refusal) throw new Error(refusal);
  const [card, ...rest] = deck === "research" ? state.decks.research : state.decks.encounters[deck]!;
  if (card === undefined) throw new Error(`the ${deck} deck is empty`);
  const decks = deck === "research" ? { ...state.decks, research: rest } : { ...state.decks, encounters: { ...state.decks.encounters, [deck]: rest } };
  return log({ ...state, decks, phase: { ...phase, card: { deck, id: card } } }, `draws from the ${deck} deck: the card text is left to the players`);
}

/** Discards the drawn card and passes to the next seat once every monster on the space was fought; after the last the Mythos phase draws its card. */
export function finishEncounter(state: GameState, content: Content): GameState {
  const phase = encounterPhase(state);
  const me = active(state);
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
 * Defeat at 0 health or sanity (manual p.4): doom advances by 1, the seat is skipped from now on, the lead passes when needed;
 * with nobody standing the game is lost. Deviation: the pawn stays where it fell and nobody replaces the investigator.
 */
export function defeat(state: GameState, investigator: string, cause: "health" | "sanity"): GameState {
  const me = state.investigators.find((i) => i.id === investigator);
  if (!me) throw new Error(`no investigator ${investigator}`);
  let s = replaceInvestigator({ ...state, doom: state.doom - 1 }, { ...me, defeated: cause });
  if (s.leadInvestigator === investigator) s = { ...s, leadInvestigator: nextStanding(s, investigator) ?? investigator };
  if (!s.investigators.some((i) => !i.defeated)) return { ...s, phase: { name: "lost", reason: `every investigator is defeated (doom ${s.doom})` } };
  // shortcut: defeat is only reached from combat today; a defeat in the Action phase would leave the active seat on a fallen investigator, upgrade when encounter text is applied by hand.
  return s.phase.name === "encounter" && s.phase.active === investigator ? advance(s, investigator) : s;
}
