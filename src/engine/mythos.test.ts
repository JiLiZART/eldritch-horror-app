import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board, MythosCard } from "../content/types";
import { endTurn } from "./actions";
import { finishEncounter } from "./encounter";
import { nextRound, resolveMythos } from "./mythos";
import { setupGame } from "./setup";
import type { GameState } from "./types";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const content = { board, set };
const leo = "eh01/investigator/leo-anderson";
const lily = "eh01/investigator/lily-chen";
const seats = (n: number) => set.investigators.slice(0, n).map((i) => i.id);
/** Leo Anderson leads, Lily Chen second; Azathoth at doom 15. */
const game = (investigators = [leo, lily]) => setupGame(content, { ancientOne: "eh01/ancient-one/azathoth", investigators, seed: 3 });
/** The Mythos phase at the end of round 1 with a made-up card on top. */
const mythos = (card: Partial<MythosCard>, s = game()): { state: GameState; content: typeof content } => {
  const fake: MythosCard = { id: "eh01/mythos/test/card", name: "Test", color: "green", difficulty: "easy", trait: "event", effects: [], images: { front: "x.webp" }, ...card };
  // Monsters on the investigators' spaces would have to be fought first; the mythos tests are not about that.
  let drawn: GameState = { ...s, decks: { ...s.decks, mythos: [fake.id, ...s.decks.mythos] }, monsters: s.monsters.filter((m) => !s.investigators.some((i) => i.space === m.space)) };
  while (drawn.phase.name === "action" || drawn.phase.name === "encounter") drawn = drawn.phase.name === "action" ? endTurn(drawn) : finishEncounter(drawn, content);
  return { state: drawn, content: { board, set: { ...set, mythos: [...set.mythos, fake] } } };
};
const resolve = (card: Partial<MythosCard>, s?: GameState) => {
  const m = mythos(card, s);
  return resolveMythos(m.state, m.content);
};
const log = (s: GameState) => (s.phase.name === "mythos" ? (s.phase.log ?? []).join("\n") : "");

/** The last encounter of round 1 finished. */
const lastEncounter = (s: GameState) => finishEncounter(finishEncounter(endTurn(endTurn(s)), content), content);

describe("the last encounter opens the Mythos phase", () => {
  it("draws the top card when the last investigator finishes", () => {
    const s = game();
    const top = s.decks.mythos[0];
    const next = lastEncounter(s);
    expect(next.phase).toEqual({ name: "mythos", card: top });
    expect(next.decks.mythos).toEqual(s.decks.mythos.slice(1));
    expect(next.round).toBe(1);
  });
  it("loses the game naming the mythos deck when no card can be drawn", () => {
    const s = game();
    const next = lastEncounter({ ...s, decks: { ...s.decks, mythos: [] } });
    expect(next.phase).toEqual({ name: "lost", reason: expect.stringMatching(/mythos deck/) });
  });
  it("keeps the seat order before the last seat", () => {
    expect(endTurn(game()).phase).toEqual({ name: "action", active: lily, taken: [] });
  });
});

describe("icons resolve in printed order", () => {
  it("advances the omen without doom when no gate matches", () => {
    const s = { ...game(), omen: 0, gates: ["arkham", "rome"], doom: 12 };
    const next = resolve({ effects: ["advance-omen"] }, s);
    expect(next.omen).toBe(1);
    expect(next.doom).toBe(12);
  });
  it("advances doom by 1 per gate matching the new omen", () => {
    const s = { ...game(), omen: 1, gates: ["arkham"], doom: 12 };
    const next = resolve({ effects: ["advance-omen"] }, s);
    expect(next.omen).toBe(2);
    expect(next.doom).toBe(11);
    expect(log(next)).toMatch(/omen.*red/i);
  });
  it("wraps the omen from the last track space back to green", () => {
    expect(resolve({ effects: ["advance-omen"] }, { ...game(), omen: 3 }).omen).toBe(0);
  });
  it("spawns the reference card's gates each with a monster", () => {
    const s = { ...game(seats(4)), gateStack: ["london", "rome"], gates: [], monsters: [] };
    const next = resolve({ effects: ["spawn-gates"] }, s);
    expect(next.gates).toEqual(["london"]);
    expect(next.gateStack).toEqual(["rome"]);
    expect(next.monsters).toHaveLength(1);
    expect(next.monsters[0]?.id).toBe(s.monsterCup[0]?.id);
  });
  it("advances doom instead when no gate token is left", () => {
    const s = { ...game(), gateStack: [], gateDiscard: [], doom: 10 };
    const next = resolve({ effects: ["spawn-gates"] }, s);
    expect(next.doom).toBe(9);
    expect(next.gates).toEqual(s.gates);
  });
  it("surges the reference card's monsters at each gate matching the omen", () => {
    const s = { ...game(seats(5)), omen: 2, gates: ["arkham"], monsters: [] };
    const next = resolve({ effects: ["monster-surge"] }, s);
    expect(next.monsters).toHaveLength(2);
    expect(next.monsterCup).toEqual(s.monsterCup.slice(2));
    expect(log(next)).toMatch(/Arkham/);
  });
  it("spawns 1 gate with its monster when no gate matches the omen", () => {
    const s = { ...game(), omen: 0, gates: ["arkham"], gateStack: ["london"], monsters: [] };
    const next = resolve({ effects: ["monster-surge"] }, s);
    expect(next.gates).toEqual(["arkham", "london"]);
    expect(next.monsters).toHaveLength(1);
  });
  it("spawns the reference card's clues from the top of the pool", () => {
    const s = { ...game(seats(3)), clues: [] };
    const next = resolve({ effects: ["spawn-clues"] }, s);
    expect(next.clues).toEqual(s.cluePool.slice(0, 2));
    expect(next.cluePool).toEqual(s.cluePool.slice(2));
  });
  it("logs the steps left to the players and keeps a rumor in play", () => {
    const next = resolve({ trait: "ongoing", effects: ["place-rumor", "resolve-text"] });
    expect(log(next)).toMatch(/rumor token.*players/i);
    expect(log(next)).toMatch(/card text.*players/i);
    expect(next.ongoingMythos).toEqual(["eh01/mythos/test/card"]);
  });
  it("logs reckoning and the card text of an event", () => {
    const next = resolve({ effects: ["advance-omen", "reckoning", "spawn-clues"] });
    expect(log(next)).toMatch(/reckoning.*players/i);
    expect(log(next)).toMatch(/card text/i);
  });
  it("refuses to resolve the same card twice", () => {
    const m = mythos({ effects: ["advance-omen"] });
    const once = resolveMythos(m.state, m.content);
    expect(() => resolveMythos(once, m.content)).toThrow(/already resolved/);
    expect(() => resolveMythos(game(), m.content)).toThrow(/Mythos phase/);
  });
});

describe("cards leave play by trait", () => {
  it("discards an event", () => {
    const next = resolve({ trait: "event", effects: ["advance-omen"] });
    expect(next.mythosDiscard).toEqual(["eh01/mythos/test/card"]);
    expect(next.ongoingMythos).toEqual([]);
  });
  it("keeps an ongoing card in play", () => {
    const next = resolve({ trait: "ongoing", effects: ["advance-omen"] });
    expect(next.ongoingMythos).toEqual(["eh01/mythos/test/card"]);
    expect(next.mythosDiscard).toEqual([]);
  });
});

describe("the lead may pass the token", () => {
  it("refuses the next round before the card is resolved", () => {
    const m = mythos({ effects: ["advance-omen"] });
    expect(() => nextRound(m.state)).toThrow(/resolve/);
    expect(() => nextRound(game())).toThrow(/Mythos phase/);
  });
  it("passes the lead to Lily Chen for round 2", () => {
    const next = nextRound(resolve({ effects: ["advance-omen"] }), lily);
    expect(next.leadInvestigator).toBe(lily);
    expect(next.round).toBe(2);
    expect(next.phase).toEqual({ name: "action", active: lily, taken: [] });
  });
  it("lets every seat act after the lead moved, then opens the Encounter phase with the lead", () => {
    const round2 = nextRound(resolve({ effects: ["advance-omen"] }), lily);
    const leoTurn = endTurn(round2);
    expect(leoTurn.phase).toEqual({ name: "action", active: leo, taken: [] });
    expect(endTurn(leoTurn).phase).toEqual({ name: "encounter", active: lily, log: [], fought: [] });
  });
  it("keeps Leo Anderson as lead by default", () => {
    const next = nextRound(resolve({ effects: ["advance-omen"] }));
    expect(next.leadInvestigator).toBe(leo);
    expect(next.phase).toEqual({ name: "action", active: leo, taken: [] });
  });
  it("refuses an unknown investigator as the new lead", () => {
    expect(() => nextRound(resolve({ effects: ["advance-omen"] }), "eh01/investigator/nope")).toThrow(/nope/);
  });
});
