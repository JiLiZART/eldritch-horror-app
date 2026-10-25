import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { setupGame } from "./setup";
import type { SetupOptions } from "./types";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const content = { board, set };

const inv = (name: string) => `eh01/investigator/${name}`;
const ao = (name: string) => `eh01/ancient-one/${name}`;
const all = set.investigators.map((i) => i.id);
const setup = (opts: Partial<SetupOptions> = {}) =>
  setupGame(content, { ancientOne: ao("azathoth"), investigators: [inv("akachi-onyele"), inv("charlie-kane")], seed: 1, ...opts });

describe("setup accepts a legal group", () => {
  it("refuses nine investigators naming the limit", () => {
    expect(() => setup({ investigators: all.slice(0, 9) })).toThrow(/8/);
  });
  it("refuses an empty group", () => {
    expect(() => setup({ investigators: [] })).toThrow();
  });
  it("refuses a duplicate investigator naming it", () => {
    expect(() => setup({ investigators: [inv("lily-chen"), inv("lily-chen")] })).toThrow(/lily-chen/);
  });
  it("refuses unknown ids", () => {
    expect(() => setup({ ancientOne: ao("nope") })).toThrow(/nope/);
    expect(() => setup({ investigators: [inv("nope")] })).toThrow(/nope/);
  });
  it("gives the lead token to seat 0", () => {
    const s = setup({ investigators: [inv("leo-anderson"), inv("lily-chen")] });
    expect(s.leadInvestigator).toBe(inv("leo-anderson"));
    expect(s.investigators.map((i) => i.id)).toEqual([inv("leo-anderson"), inv("lily-chen")]);
  });
  it("starts round 1 in the Action phase with the lead active, no action taken and no tickets", () => {
    const s = setup({ investigators: [inv("leo-anderson"), inv("lily-chen")] });
    expect(s.round).toBe(1);
    expect(s.phase).toEqual({ name: "action", active: inv("leo-anderson"), taken: [] });
    expect(s.investigators.map((i) => i.tickets)).toEqual([[], []]);
  });
});

describe("investigators start as printed", () => {
  const s = setup();
  it("places Akachi Onyele with her sheet values and starting possessions", () => {
    const akachi = s.investigators[0]!;
    expect(akachi).toMatchObject({ space: "space-15", health: 5, sanity: 7, clues: 1 });
    expect(akachi.possessions).toHaveLength(1);
    expect(akachi.possessions[0]).toMatch(/^eh01\/spell\/mists-of-releh/);
    expect(s.decks.spell).not.toContain(akachi.possessions[0]);
  });
  it("takes starting clues from the pool", () => {
    expect(s.cluePool.length + s.clues.length).toBe(36 - 1);
  });
  it("takes Charlie Kane's Personal Assistant out of the asset deck and reserve", () => {
    const charlie = s.investigators[1]!;
    expect(charlie.possessions).toEqual(["eh01/asset/personal-assistant"]);
    expect([...s.decks.asset, ...s.reserve]).not.toContain("eh01/asset/personal-assistant");
  });
});

describe("doom and omen", () => {
  it("starts Cthulhu at doom 12 with the omen on green", () => {
    const s = setup({ ancientOne: ao("cthulhu") });
    expect(s.doom).toBe(12);
    expect(s.omen).toBe(0);
    expect(s.eldritchOnOmen).toEqual([0, 0, 0, 0]);
  });
  it("places Azathoth's eldritch token on the green omen space", () => {
    expect(setup().eldritchOnOmen).toEqual([1, 0, 0, 0]);
  });
});

describe("monster cup", () => {
  const count = (tokens: { id: string }[], id: string) => tokens.filter((m) => m.id === `eh01/monster/${id}`).length;
  it("holds 34 core tokens for Azathoth, no epic monster", () => {
    const s = setup();
    const everywhere = [...s.monsterCup, ...s.monsters];
    expect(everywhere).toHaveLength(34);
    expect(count(everywhere, "cultist")).toBe(5);
    expect(count(everywhere, "ghoul")).toBe(2);
    expect(count(everywhere, "cthulhu")).toBe(0);
    expect(s.setAsideMonsters).toEqual([]);
  });
  it("sets Cthulhu's Deep One and Star Spawn aside", () => {
    const s = setup({ ancientOne: ao("cthulhu") });
    const everywhere = [...s.monsterCup, ...s.monsters];
    expect(count(everywhere, "deep-one")).toBe(0);
    expect(count(everywhere, "star-spawn")).toBe(0);
    expect(s.setAsideMonsters.map((m) => m.id).sort()).toEqual(["eh01/monster/deep-one", "eh01/monster/star-spawn"]);
  });
  it("sets both of Shub-Niggurath's Ghouls aside and keeps instances distinct", () => {
    const s = setup({ ancientOne: ao("shub-niggurath") });
    const ghouls = s.setAsideMonsters.filter((m) => m.id === "eh01/monster/ghoul");
    expect(ghouls.map((g) => g.instance).sort()).toEqual([1, 2]);
    expect(count(s.monsterCup, "ghoul")).toBe(0);
  });
});

describe("mythos deck", () => {
  const color = (id: string) => set.mythos.find((m) => m.id === id)!.color;
  const difficulty = (id: string) => set.mythos.find((m) => m.id === id)!.difficulty;
  const tally = (ids: string[]) => ids.reduce((t, id) => ({ ...t, [color(id)]: (t[color(id)] ?? 0) + 1 }), {} as Record<string, number>);
  it("builds Azathoth's deck in three stages, stage I on top", () => {
    const deck = setup().decks.mythos;
    expect(deck).toHaveLength(16);
    expect(tally(deck.slice(0, 4))).toEqual({ green: 1, yellow: 2, blue: 1 });
    expect(tally(deck.slice(4, 10))).toEqual({ green: 2, yellow: 3, blue: 1 });
    expect(tally(deck.slice(10))).toEqual({ green: 2, yellow: 4 });
    expect(new Set(deck).size).toBe(16);
  });
  it("uses no easy card at hard difficulty and no hard card at easy", () => {
    expect(setup({ difficulty: "hard" }).decks.mythos.map(difficulty)).not.toContain("easy");
    expect(setup({ difficulty: "easy" }).decks.mythos.map(difficulty)).not.toContain("hard");
  });
  it("refuses a deck that needs more blue cards than exist, naming blue", () => {
    const greedy = { ...set.ancientOnes[0]!, mythos: { ...set.ancientOnes[0]!.mythos, stage1: { green: 0, yellow: 0, blue: 13 } } };
    const contrived = { board, set: { ...set, ancientOnes: [greedy] } };
    expect(() => setupGame(contrived, { ancientOne: greedy.id, investigators: [inv("lily-chen")], seed: 1 })).toThrow(/blue/);
  });
});

describe("gates and clues per the reference card", () => {
  const cities = board.spaces.filter((s) => s.set === "eh01" && s.kind === "city" && s.number === undefined).map((s) => s.id).sort();
  it("spawns 1 gate with a monster and 2 clues for four investigators", () => {
    const s = setup({ investigators: all.slice(0, 4) });
    expect(s.referenceCard).toEqual({ gates: 1, clues: 2, surge: 2 });
    expect(s.gates).toHaveLength(1);
    expect(cities).toContain(s.gates[0]);
    expect(s.monsters).toHaveLength(1);
    expect(s.clues).toHaveLength(2);
    expect(new Set(s.clues).size).toBe(2);
    expect(s.gateStack).toHaveLength(8);
    expect([...s.gateStack, ...s.gates].sort()).toEqual(cities);
  });
  it("spawns 2 gates and 4 clues for seven investigators", () => {
    const s = setup({ investigators: all.slice(0, 7) });
    expect(s.referenceCard).toEqual({ gates: 2, clues: 4, surge: 3 });
    expect(new Set(s.gates).size).toBe(2);
    expect(s.monsters).toHaveLength(2);
    expect(s.clues).toHaveLength(4);
  });
  it("uses 1/1/1 for one or two investigators and 2/3/2 for five or six", () => {
    expect(setup({ investigators: [inv("lily-chen")] }).referenceCard).toEqual({ gates: 1, clues: 1, surge: 1 });
    expect(setup({ investigators: all.slice(0, 6) }).referenceCard).toEqual({ gates: 2, clues: 3, surge: 2 });
  });
  it("puts a monster where its token says when it is spawned at a gate", () => {
    let found: ReturnType<typeof setup> | undefined;
    for (let seed = 0; seed < 2000 && !found; seed++) {
      const s = setup({ seed, investigators: [inv("lily-chen")] });
      if (s.monsters[0]!.id === "eh01/monster/color-out-of-space") found = s;
    }
    expect(found).toBeDefined();
    expect(found!.monsters[0]!.space).toBe("tunguska");
    expect(found!.gates[0]).not.toBe("tunguska");
  });
  it("puts an ordinary monster on the gate's space", () => {
    const s = setup();
    const m = s.monsters[0]!;
    const moveTo = set.monsters.find((x) => x.id === m.id)!.spawnMoveTo;
    expect(m.space).toBe(moveTo ?? s.gates[0]);
  });
});

describe("reserve, expedition and mystery", () => {
  const s = setup({ ancientOne: ao("cthulhu") });
  it("deals 4 assets to the reserve", () => {
    expect(s.reserve).toHaveLength(4);
    expect(s.decks.asset).toHaveLength(40 - 4 - 1);
  });
  it("puts the active expedition on the top expedition card's space", () => {
    const wilderness = board.spaces.filter((x) => x.set === "eh01" && x.kind === "wilderness");
    const top = s.decks.encounters.expedition![0]!;
    const name = set.encounterDecks.find((d) => d.id === "expedition")!.cards.find((c) => c.id === top)!.name.replace(/ - \d+$/, "");
    expect(wilderness.map((w) => w.id)).toContain(s.activeExpedition);
    expect(wilderness.find((w) => w.id === s.activeExpedition)!.name.en).toBe(name);
  });
  it("draws one Cthulhu mystery and leaves three", () => {
    expect(s.currentMystery).toMatch(/^eh01\/ancient-one\/cthulhu\/mystery\//);
    expect(s.decks.mystery).toHaveLength(3);
    expect(s.decks.mystery).not.toContain(s.currentMystery);
    expect(s.decks.research).toHaveLength(8);
  });
  it("shuffles the other decks", () => {
    expect(s.decks.condition).not.toEqual(set.cards.filter((c) => c.deck === "condition").map((c) => c.id));
    expect(s.decks.encounters.general).not.toEqual(set.encounterDecks.find((d) => d.id === "general")!.cards.map((c) => c.id));
    expect(s.decks.condition).toHaveLength(36);
  });
});

describe("reproducible", () => {
  it("gives identical states for the same seed and different ones otherwise", () => {
    expect(setup({ seed: 99 })).toEqual(setup({ seed: 99 }));
    expect(setup({ seed: 99 })).not.toEqual(setup({ seed: 100 }));
    expect(setup({ seed: 99 }).seed).toBe(99);
  });
});
