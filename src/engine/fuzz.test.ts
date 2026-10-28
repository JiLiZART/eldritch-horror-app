import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { neighbors } from "../content/board";
import { loadSet } from "../content/load";
import type { Board, Skill } from "../content/types";
import { acquireAssets, componentAction, endTurn, prepareForTravel, rest, takeAssets, takeBankLoan, trade, travel } from "./actions";
import { changeDoom, changeMysteryTokens, solveFinalMystery, solveMystery } from "./ancientOne";
import * as fx from "./effects";
import { continueFight, drawEncounter, encounterFallen, fight, finishEncounter } from "./encounter";
import { nextRound, replaceInvestigator, resolveMythos } from "./mythos";
import { rng } from "./rng";
import { setupGame } from "./setup";
import { rerollDie } from "./test";
import type { GameState } from "./types";

/** Random play through the public engine (design D1–D4): refusals are expected, anything else is a bug. */

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const content = { board, set };
const SKILLS: Skill[] = ["lore", "influence", "observation", "strength", "will"];
const NEAREST = ["city", "wilderness", "sea", "gate", "clue"] as const;
type Step = (s: GameState) => GameState;
/** A candidate with its weight (design D1): advancing steps 8, ordinary effects 1, game-ending ones rare. */
type Weighted = [weight: number, step: Step];

/** Totals the game must keep (design D3). */
function reference(s: GameState) {
  const epic = new Set(set.monsters.filter((m) => m.epic).map((m) => m.id));
  const tokens = [...s.monsterCup, ...s.monsters, ...s.setAsideMonsters];
  const deckTotals = Object.fromEntries(Object.entries(s.decks.encounters).map(([k, v]) => [k, v.length]));
  return {
    nonEpic: tokens.filter((t) => !epic.has(t.id)).length,
    epic,
    clues: s.cluePool.length + s.clues.length + s.clueDiscard.length + s.heldClues.length,
    gates: s.gateStack.length + s.gateDiscard.length + s.gates.length,
    cards: Object.fromEntries((["asset", "spell", "condition", "artifact", "unique-asset"] as const).map((d) => [d, countCards(s, d)])),
    encounters: deckTotals,
    research: s.decks.research.length,
    special: s.decks.special.length,
    mythos: s.decks.mythos.length,
    doom: s.doom,
  };
}
function countCards(s: GameState, deck: "asset" | "spell" | "condition" | "artifact" | "unique-asset"): number {
  const held = s.investigators.flatMap((i) => [...i.possessions, ...i.conditions]).filter((c) => set.cards.find((x) => x.id === c)?.deck === deck).length;
  const pile = deck === "asset" ? s.assetDiscard.length + s.reserve.length : deck === "artifact" ? s.artifactDiscard.length : 0;
  return s.decks[deck].length + held + pile;
}

function check(s: GameState, ref: ReturnType<typeof reference>, where: string, prev: GameState): void {
  const journalBefore = prev.journal.length;
  const keys = [...s.monsterCup, ...s.monsters, ...s.setAsideMonsters].map((t) => `${t.id}#${t.instance}`);
  expect(new Set(keys).size, `${where}: duplicate monster token`).toBe(keys.length);
  expect([...s.monsterCup, ...s.monsters, ...s.setAsideMonsters].filter((t) => !ref.epic.has(t.id)).length, `${where}: non-epic tokens`).toBe(ref.nonEpic);
  expect(s.heldClues.length, `${where}: held clues`).toBe(s.investigators.reduce((n, i) => n + i.clues, 0));
  expect(s.cluePool.length + s.clues.length + s.clueDiscard.length + s.heldClues.length, `${where}: clue tokens`).toBe(ref.clues);
  expect(s.gateStack.length + s.gateDiscard.length + s.gates.length, `${where}: gate tokens`).toBe(ref.gates);
  for (const d of ["asset", "spell", "condition", "artifact", "unique-asset"] as const) expect(countCards(s, d), `${where}: ${d} cards`).toBe(ref.cards[d]);
  if (s.phase.name === "won" || s.phase.name === "lost") return;
  const inPlay = (deck: string) => (s.phase.name === "encounter" && s.phase.card?.deck === deck ? 1 : 0);
  for (const [k, total] of Object.entries(ref.encounters)) expect((s.decks.encounters[k]?.length ?? 0) + (s.encounterDiscards[k]?.length ?? 0) + inPlay(k), `${where}: ${k} deck`).toBe(total);
  expect(s.decks.research.length + (s.encounterDiscards.research?.length ?? 0) + inPlay("research"), `${where}: research deck`).toBe(ref.research);
  expect(s.decks.special.length + (s.encounterDiscards.special?.length ?? 0) + inPlay("special"), `${where}: special deck`).toBe(ref.special);
  expect(s.decks.mythos.length + s.mythosDiscard.length + s.ongoingMythos.length + (s.phase.name === "mythos" && !s.phase.log ? 1 : 0), `${where}: mythos cards`).toBe(ref.mythos);
  expect(s.doom, `${where}: doom`).toBeGreaterThanOrEqual(0);
  expect(s.doom, `${where}: doom`).toBeLessThanOrEqual(ref.doom);
  expect(s.omen, `${where}: omen`).toBeGreaterThanOrEqual(0);
  expect(s.omen, `${where}: omen`).toBeLessThanOrEqual(3);
  expect(s.journal.length, `${where}: journal`).toBeGreaterThanOrEqual(journalBefore);
  expect(JSON.parse(JSON.stringify(s)), `${where}: JSON round trip`).toEqual(s);
  // Phase invariants (design D2).
  const seated = (id: string) => s.investigators.find((i) => i.id === id);
  const activeId = s.phase.name === "action" || s.phase.name === "encounter" ? s.phase.active : undefined;
  const standing = (id: string, role: string) => {
    const i = seated(id);
    expect(i, `${where}: ${role} ${id} seated`).toBeDefined();
    expect(i?.defeated ?? i?.removed, `${where}: ${role} ${id} standing`).toBeUndefined();
  };
  if (activeId) standing(activeId, "active");
  standing(s.leadInvestigator, "lead");
  if (s.phase.name === "action") expect("card" in s.phase, `${where}: card in the Action phase`).toBe(false);
  if (s.phase.name !== "encounter") expect("combat" in s.phase, `${where}: fight outside the Encounter phase`).toBe(false);
  expect(s.round, `${where}: round`).toBe(prev.phase.name === "mythos" && s.phase.name === "action" ? prev.round + 1 : prev.round);
  if (prev.phase.name === "mythos" && s.phase.name === "action") expect(s.usedComponents, `${where}: used components at the round start`).toEqual([]);
  for (const i of s.investigators) if (i.replacedBy) expect(seated(i.replacedBy), `${where}: replacement ${i.replacedBy}`).toBeDefined();
  // Each investigator's own numbers stay within the rules (manual p.3–4; fuzz-bounds D1).
  const spaces = new Set(board.spaces.map((x) => x.id));
  for (const i of s.investigators) {
    const printed = set.investigators.find((x) => x.id === i.id)!;
    expect(i.health, `${where}: ${i.id} health`).toBeGreaterThanOrEqual(0);
    expect(i.health, `${where}: ${i.id} health`).toBeLessThanOrEqual(printed.health);
    expect(i.sanity, `${where}: ${i.id} sanity`).toBeGreaterThanOrEqual(0);
    expect(i.sanity, `${where}: ${i.id} sanity`).toBeLessThanOrEqual(printed.sanity);
    expect(i.clues, `${where}: ${i.id} clues`).toBeGreaterThanOrEqual(0);
    expect(i.tickets.length, `${where}: ${i.id} tickets`).toBeLessThanOrEqual(2);
    for (const [skill, level] of Object.entries(i.improvements)) expect([1, 2], `${where}: ${i.id} ${skill} improvement`).toContain(level);
    expect(spaces.has(i.space), `${where}: ${i.id} on ${i.space}`).toBe(true);
    if (i.defeated === "health") expect(i.health, `${where}: ${i.id} defeated by health`).toBe(0);
    if (i.defeated === "sanity") expect(i.sanity, `${where}: ${i.id} defeated by sanity`).toBe(0);
  }
  for (const m of s.monsters) expect(spaces.has(m.space), `${where}: monster ${m.id} on ${m.space}`).toBe(true);
}

/** Candidate steps for the state, each closing over random picks. */
function candidates(s: GameState, pick: <T>(items: T[]) => T | undefined): Weighted[] {
  const standing = s.investigators.filter((i) => !i.defeated);
  const who = pick(standing)?.id ?? standing[0]!.id;
  const me = s.investigators.find((i) => i.id === who)!;
  const held = pick([...me.possessions, ...me.conditions]) ?? "none";
  const space = pick(board.spaces.map((sp) => sp.id)) ?? "arkham";
  const monster = pick(s.monsters) ?? { id: "none", instance: 0 };
  const cupKind = pick(s.monsterCup)?.id ?? "none";
  const asideKind = pick(s.setAsideMonsters)?.id ?? "none";
  const fallen = pick(s.investigators.filter((i) => i.defeated))?.id ?? "none";
  const unused = pick(set.investigators.filter((i) => !s.investigators.some((x) => x.id === i.id)))?.id ?? "none";
  const text: Weighted[] = [
    [1, (t) => fx.changeHealth(t, content, who, 1)],
    [1, (t) => fx.changeSanity(t, content, who, 1)],
    [0.2, (t) => fx.changeHealth(t, content, who, -1)],
    [0.2, (t) => fx.changeSanity(t, content, who, -1)],
    [1, (t) => fx.gainClue(t, content, who)],
    [1, (t) => fx.spendClue(t, content, who)],
    [1, (t) => fx.delay(t, content, who)],
    [1, (t) => fx.standUp(t, content, who)],
    [1, (t) => fx.improveSkill(t, content, who, pick(SKILLS)!)],
    [1, (t) => fx.discardImprovement(t, content, who, pick(SKILLS)!)],
    [1, (t) => fx.moveInvestigator(t, content, who, space)],
    [1, (t) => fx.moveInvestigatorToNearest(t, content, who, pick([...NEAREST])!)],
    [1, (t) => fx.moveInvestigatorRandomly(t, content, who)],
    [1, (t) => fx.closeGate(t, content, who)],
    [1, (t) => fx.gainCard(t, content, who, pick(["asset", "spell", "condition", "artifact"] as const)!)],
    [1, (t) => fx.discardCard(t, content, who, held)],
    [1, (t) => fx.moveMonster(t, content, monster, space)],
    [1, (t) => fx.moveMonsterToward(t, content, monster)],
    [1, (t) => fx.discardMonster(t, content, monster)],
    [1, (t) => fx.placeToken(t, content, pick(["rumor", "eldritch"] as const)!, space)],
    [1, (t) => fx.removeToken(t, content, pick(["rumor", "eldritch"] as const)!, space)],
    [1, (t) => fx.changeEldritchOnOmen(t, pick([0, 1, 2, 3])!, pick([-1, 1])!)],
    [1, (t) => fx.spawnGateByText(t, content, who)],
    [1, (t) => fx.spawnClueByText(t, content, who)],
    [1, (t) => fx.spawnMonsterByText(t, content, who, space)],
    [1, (t) => fx.spawnMonsterRandomly(t, content, who)],
    [1, (t) => fx.spawnNamed(t, content, who, cupKind, space)],
    [1, (t) => fx.spawnSetAside(t, content, who, asideKind, space)],
    [1, (t) => fx.takePossessions(t, content, who, fallen)],
    [1, (t) => changeDoom(t, content, 1)],
    [0.1, (t) => changeDoom(t, content, -1)],
    [1, (t) => changeMysteryTokens(t, pick([-1, 1])!)],
    [0.1, (t) => solveMystery(t, content)],
    [0.1, (t) => solveFinalMystery(t, content)],
    [1, (t) => rerollDie(t, set, pick([0, 1, 2])!)],
  ];
  if (s.phase.name === "action") {
    const phase = s.phase;
    const active = s.investigators.find((i) => i.id === phase.active)!;
    const partner = pick(standing.filter((i) => i.id !== active.id && i.space === active.space))?.id ?? "none";
    return [
      [8, endTurn],
      [1, (t) => rest(t, set)],
      [1, (t) => travel(t, board, [pick(neighbors(board, active.space)) ?? active.space])],
      [1, (t) => prepareForTravel(t, board, pick(["train", "ship"] as const)!, pick(["train", "ship", undefined] as const))],
      [1, (t) => acquireAssets(t, board, set)],
      [2, (t) => takeAssets(t, set, [], undefined)],
      [2, (t) => takeAssets(t, set, [pick(t.reserve) ?? "none"])],
      [1, (t) => takeBankLoan(t, set)],
      [1, (t) => rerollDie(t, set, pick([0, 1, 2])!)],
      [1, (t) => componentAction(t, set, pick([active.id, ...active.possessions]) ?? active.id)],
      [1, (t) => trade(t, { partner, give: { possessions: active.possessions.slice(0, 1) }, receive: {} })],
    ];
  }
  if (s.phase.name === "encounter") {
    const phase = s.phase;
    const active = s.investigators.find((i) => i.id === phase.active)!;
    const decks = [...new Set([board.spaces.find((sp) => sp.id === active.space)?.region, "general", "research", "other-world", "expedition", "special"])].filter((d): d is string => !!d);
    return [
      [8, (t) => finishEncounter(t, content)],
      [4, (t) => fight(t, content, pick(t.monsters.filter((m) => m.space === active.space)) ?? monster)],
      [8, (t) => continueFight(t, content)],
      [4, (t) => drawEncounter(t, content, pick(decks)!)],
      [1, (t) => encounterFallen(t, content, fallen)],
      [0.3, (t) => fx.ambush(t, content)],
      [0.05, (t) => fx.devour(t, content, who)],
      ...text,
    ];
  }
  if (s.phase.name === "mythos") {
    return [[8, (t) => resolveMythos(t, content)], [8, (t) => nextRound(t, set, pick(standing)?.id)], [8, (t) => replaceInvestigator(t, content, fallen, unused)], ...text];
  }
  return [];
}

/** Seeds played: six by default, more with `FUZZ_SEEDS=<n>` (fuzz-seeds D1). */
const SEEDS = Number(process.env.FUZZ_SEEDS) || 6;

describe("random play keeps the engine's invariants", () => {
  for (const seed of Array.from({ length: SEEDS }, (_, i) => i + 1)) {
    it(`seed ${seed}`, () => {
      const random = rng(seed * 7919);
      const pick = <T>(items: T[]): T | undefined => items[Math.floor(random() * items.length)];
      const seats = 2 + Math.floor(random() * 3);
      const ancientOne = pick(set.ancientOnes)!.id;
      let s = setupGame(content, { ancientOne, investigators: set.investigators.slice(0, seats).map((i) => i.id), seed });
      const ref = reference(s);
      let refusals = 0;
      for (let step = 0; step < 1500 && s.round <= 20 && s.phase.name !== "won" && s.phase.name !== "lost"; step++) {
        const options = candidates(s, pick);
        const total = options.reduce((n, [w]) => n + w, 0);
        let roll = random() * total;
        const chosen = (options.find(([w]) => (roll -= w) < 0) ?? options.at(-1))![1];
        const label = chosen.toString().replace(/\s+/g, " ").slice(0, 90);
        let next: GameState;
        try {
          next = chosen(s);
        } catch (e) {
          if (e instanceof Error && e.constructor === Error) {
            refusals++;
            continue;
          }
          throw new Error(`seed ${seed}, round ${s.round}, ${s.phase.name} step ${step} [${label}]: ${String(e)}`);
        }
        check(next, ref, `seed ${seed}, round ${s.round}, ${s.phase.name} step ${step} [${label}]`, s);
        s = next;
      }
      expect(refusals).toBeGreaterThan(0);
      if (s.phase.name !== "won" && s.phase.name !== "lost") expect(s.round, `seed ${seed}: depth`).toBeGreaterThanOrEqual(5);
    });
  }
});
