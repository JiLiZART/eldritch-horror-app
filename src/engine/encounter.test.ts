import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "../content/load";
import type { Board } from "../content/types";
import { endTurn, rest } from "./actions";
import { continueFight, defeat, drawEncounter, fight, finishEncounter } from "./encounter";
import { nextRound, replaceInvestigator, resolveMythos } from "./mythos";
import { setupGame } from "./setup";
import { rerollDie, test } from "./test";
import type { GameState, InvestigatorState } from "./types";

const root = join(import.meta.dirname, "../..");
const board: Board = JSON.parse(readFileSync(join(root, "content/board/board.json"), "utf8"));
const set = loadSet(join(root, "content/sets/eh01"))!;
const content = { board, set };
const leo = "eh01/investigator/leo-anderson";
const lily = "eh01/investigator/lily-chen";
const byakhee = "eh01/monster/byakhee";
const ghoul = "eh01/monster/ghoul";
/** Leo Anderson leads on Buenos Aires, Lily Chen second on Shanghai; Azathoth at doom 15, no monster on either space for seed 3. */
const game = (investigators = [leo, lily]) => setupGame(content, { ancientOne: "eh01/ancient-one/azathoth", investigators, seed: 3 });
const who = (s: GameState, id: string) => s.investigators.find((i) => i.id === id)!;
const patch = (s: GameState, id: string, fields: Partial<InvestigatorState>): GameState => ({ ...s, investigators: s.investigators.map((i) => (i.id === id ? { ...i, ...fields } : i)) });
/** Puts one token of `id` on `space`, taking it out of the cup when it is there. */
const place = (s: GameState, id: string, space: string, health = 0): GameState => {
  const token = s.monsterCup.find((m) => m.id === id) ?? { id, instance: 1 };
  return { ...s, monsterCup: s.monsterCup.filter((m) => m !== token), monsters: [...s.monsters, { ...token, space, health }] };
};
/** The Encounter phase of round 1 with Leo Anderson encountering. */
const encounters = (s = game()) => endTurn(endTurn(s));
/** A seed whose next Will and Strength tests for Leo yield the wanted successes (undefined: no test). */
const seedFor = (s: GameState, will: number | undefined, strength: number | undefined, mods = { will: 0, strength: 0 }): GameState => {
  for (let seed = 1; seed < 2000; seed++) {
    let t: GameState = { ...s, seed };
    let ok = true;
    if (will !== undefined) {
      const r = test(t, set, leo, "will", mods.will);
      ok &&= r.successes === will;
      t = r.state;
    }
    if (strength !== undefined) ok &&= test(t, set, leo, "strength", mods.strength).successes === strength;
    if (ok) return { ...s, seed };
  }
  throw new Error("no seed found");
};
const onBoard = (s: GameState, id: string) => s.monsters.filter((m) => m.id === id);
/** Fights and continues through every waiting roll. */
const brawl = (s: GameState, monster: { id: string; instance: number }): GameState => {
  let t = fight(s, content, monster);
  while (t.phase.name === "encounter" && t.phase.combat) t = continueFight(t, content);
  return t;
};

describe("investigators encounter in seat order", () => {
  it("opens the Encounter phase with the lead when the last seat ends its turn", () => {
    expect(encounters().phase).toEqual({ name: "encounter", active: leo, log: [], fought: [] });
  });
  it("passes to the next seat on finish and draws the mythos card after the last", () => {
    const s = encounters();
    const second = finishEncounter(s, content);
    expect(second.phase).toEqual({ name: "encounter", active: lily, log: [], fought: [] });
    const third = finishEncounter(second, content);
    expect(third.phase).toEqual({ name: "mythos", card: s.decks.mythos[0] });
    expect(third.decks.mythos).toHaveLength(s.decks.mythos.length - 1);
  });
  it("refuses encounter steps outside the Encounter phase", () => {
    expect(() => finishEncounter(game(), content)).toThrow(/Encounter phase/);
  });
});

describe("monsters on the space must be fought", () => {
  it("fights in the order of choice", () => {
    const s = place(place(encounters(), ghoul, "buenos-aires"), "eh01/monster/cultist", "buenos-aires");
    const cultist = s.monsters.find((m) => m.id === "eh01/monster/cultist" && m.space === "buenos-aires")!;
    const next = brawl(s, cultist);
    expect(onBoard(next, ghoul)).toHaveLength(1);
    expect(next.phase.name === "encounter" && next.phase.log.join("\n")).toMatch(/Cultist/);
  });
  it("refuses fighting the same monster twice in one encounter", () => {
    const s = place(encounters(), "eh01/monster/cultist", "buenos-aires");
    const cultist = s.monsters.find((m) => m.id === "eh01/monster/cultist" && m.space === "buenos-aires")!;
    const once = brawl(s, cultist);
    expect(onBoard(once, "eh01/monster/cultist").some((m) => m.space === "buenos-aires")).toBe(true);
    expect(() => fight(once, content, cultist)).toThrow(/once per encounter/);
  });
  it("refuses a monster on another space", () => {
    const s = place(encounters(), ghoul, "shanghai");
    expect(() => fight(s, content, s.monsters.find((m) => m.id === ghoul)!)).toThrow(/investigator's space/);
  });
  it("refuses an epic monster while a non-epic one remains", () => {
    const s = place(place(encounters(), ghoul, "buenos-aires"), "eh01/monster/cthulhu", "buenos-aires");
    expect(() => fight(s, content, { id: "eh01/monster/cthulhu", instance: 1 })).toThrow(/non-epic/);
  });
});

describe("two tests decide the fight", () => {
  const vs = (will: number | undefined, strength: number | undefined, health = 0) => {
    const s = seedFor(place(encounters(), byakhee, "buenos-aires", health), will, strength);
    return { before: s, after: brawl(s, { id: byakhee, instance: s.monsters.find((m) => m.id === byakhee)!.instance }) };
  };
  it("loses sanity and health by the difference and wounds the monster", () => {
    const { before, after } = vs(0, 1);
    expect(who(after, leo).sanity).toBe(who(before, leo).sanity - 1);
    expect(who(after, leo).health).toBe(who(before, leo).health - 1);
    expect(onBoard(after, byakhee)).toMatchObject([{ health: 1 }]);
  });
  it("defeats the monster at its toughness and returns it to the cup", () => {
    const { before, after } = vs(1, 2);
    expect(who(after, leo)).toMatchObject({ sanity: who(before, leo).sanity, health: who(before, leo).health });
    expect(onBoard(after, byakhee)).toHaveLength(0);
    expect(after.monsterCup.filter((m) => m.id === byakhee)).toHaveLength(before.monsterCup.filter((m) => m.id === byakhee).length + 1);
  });
  it("finishes a wounded monster", () => {
    const { after } = vs(1, 1, 1);
    expect(onBoard(after, byakhee)).toHaveLength(0);
  });
  it("skips a test the token does not print", () => {
    const s = place(encounters(), "eh01/monster/riot", "buenos-aires");
    const after = brawl(s, s.monsters.find((m) => m.id === "eh01/monster/riot")!);
    expect(after.rolls).toBe(s.rolls + 1);
    expect(who(after, leo).sanity).toBe(who(s, leo).sanity);
  });
  it("waits after the Will dice with nothing lost yet", () => {
    const { before } = vs(0, 1);
    const waiting = fight(before, content, before.monsters.find((m) => m.id === byakhee)!);
    expect(waiting.phase).toMatchObject({ combat: { step: "will", roll: { investigator: leo } } });
    expect(who(waiting, leo).sanity).toBe(who(before, leo).sanity);
    expect(() => drawEncounter(waiting, content, "general")).toThrow(/fight is not over/);
    expect(() => finishEncounter(waiting, content)).toThrow(/fight is not over/);
  });
  it("rerolls a Will die for a clue and logs it", () => {
    const { before } = vs(0, 1);
    const waiting = fight(patch(before, leo, { clues: 1 }), content, before.monsters.find((m) => m.id === byakhee)!);
    const rerolled = rerollDie(waiting, set, 0);
    expect(who(rerolled, leo).clues).toBe(0);
    expect(rerolled.phase.name === "encounter" ? rerolled.phase.log.at(-1) : "").toMatch(/Leo Anderson rerolls die 1: /);
  });
  it("logs the dice, the losses and the monster's fate", () => {
    const { after } = vs(0, 1);
    const log = after.phase.name === "encounter" ? after.phase.log.join("\n") : "";
    expect(log).toMatch(/Will test.*dice/);
    expect(log).toMatch(/loses 1 sanity/);
    expect(log).toMatch(/Strength test.*dice/);
    expect(log).toMatch(/loses 1 health/);
    expect(log).toMatch(/Byakhee.*(stays|1 health)/);
  });
});

describe("the back of Detained replaces the encounter", () => {
  const jailed = () => place(patch(encounters(), leo, { conditions: ["eh01/condition/detained-1"] }), ghoul, "buenos-aires");
  it("refuses a fight and a draw", () => {
    const s = jailed();
    expect(() => fight(s, content, s.monsters.find((m) => m.id === ghoul)!)).toThrow(/back of Detained/);
    expect(() => drawEncounter(s, content, "america")).toThrow(/back of Detained/);
  });
  it("finishes with the monster unfought", () => {
    const s = finishEncounter(jailed(), content);
    expect(s.phase).toMatchObject({ name: "encounter", active: lily });
    expect(onBoard(s, ghoul)).toHaveLength(1);
  });
});

describe("one encounter of the investigator's choice", () => {
  it("draws from the region's location deck", () => {
    const s = encounters();
    const next = drawEncounter(s, content, "america");
    expect(next.phase).toMatchObject({ card: { deck: "america", id: s.decks.encounters.america![0] } });
    expect(next.decks.encounters.america).toHaveLength(s.decks.encounters.america!.length - 1);
  });
  it("draws the research deck at a clue", () => {
    const s = encounters();
    const next = drawEncounter({ ...s, clues: [...s.clues, "buenos-aires"] }, content, "research");
    expect(next.phase).toMatchObject({ card: { deck: "research", id: s.decks.research[0] } });
  });
  it("refuses a deck the space does not allow", () => {
    const s = { ...encounters(), gates: [] };
    expect(() => drawEncounter(s, content, "other-world")).toThrow(/gate/);
    expect(() => drawEncounter(s, content, "asia")).toThrow(/region/);
    expect(() => drawEncounter(s, content, "expedition")).toThrow(/expedition/);
  });
  it("draws the other world deck at a gate", () => {
    const s = encounters();
    const next = drawEncounter({ ...s, gates: [...s.gates, "buenos-aires"] }, content, "other-world");
    expect(next.phase).toMatchObject({ card: { deck: "other-world" } });
  });
  it("rebuilds an empty deck from its discard before drawing", () => {
    const s = encounters();
    const cards = s.decks.encounters.america!.slice(0, 3);
    const empty: GameState = { ...s, decks: { ...s.decks, encounters: { ...s.decks.encounters, america: [] } }, encounterDiscards: { america: cards } };
    const next = drawEncounter(empty, content, "america");
    expect(cards).toContain((next.phase as { card: { id: string } }).card.id);
    expect(next.decks.encounters.america).toHaveLength(2);
    expect(next.encounterDiscards.america).toEqual([]);
  });
  it("rebuilds the deck at once when the last card is drawn", () => {
    const s = encounters();
    const [last, ...rest] = s.decks.encounters.america!;
    const thin: GameState = { ...s, decks: { ...s.decks, encounters: { ...s.decks.encounters, america: [last!] } }, encounterDiscards: { america: rest.slice(0, 2) } };
    const next = drawEncounter(thin, content, "america");
    expect((next.phase as { card: { id: string } }).card.id).toBe(last);
    expect(next.decks.encounters.america).toHaveLength(2);
    expect(next.encounterDiscards.america).toEqual([]);
  });
  it("refuses a deck whose discard is empty too", () => {
    const s = encounters();
    const empty: GameState = { ...s, decks: { ...s.decks, encounters: { ...s.decks.encounters, america: [] } } };
    expect(() => drawEncounter(empty, content, "america")).toThrow(/america deck and its discard are empty/);
  });
  it("lands the expedition token on the rebuilt deck's top card", () => {
    const s = { ...encounters(), activeExpedition: "buenos-aires" };
    const [last, ...rest] = s.decks.encounters.expedition!;
    const thin: GameState = { ...s, decks: { ...s.decks, encounters: { ...s.decks.encounters, expedition: [last!] } }, encounterDiscards: { expedition: rest } };
    const next = finishEncounter(drawEncounter(thin, content, "expedition"), content);
    expect(next.decks.encounters.expedition).toHaveLength(rest.length);
    expect(next.encounterDiscards.expedition).toEqual([last]);
    const top = set.encounterDecks.find((d) => d.id === "expedition")!.cards.find((c) => c.id === next.decks.encounters.expedition![0])!;
    expect(board.spaces.find((sp) => sp.id === next.activeExpedition)!.name.en).toBe(top.name.replace(/ - \d+$/, ""));
  });
  it("refuses a second draw", () => {
    const s = drawEncounter(encounters(), content, "america");
    expect(() => drawEncounter(s, content, "general")).toThrow(/one encounter/);
  });
  it("refuses a draw and a finish while a monster stands unfought on the space", () => {
    const s = place(encounters(), ghoul, "buenos-aires");
    expect(() => drawEncounter(s, content, "general")).toThrow(/fought first/);
    expect(() => finishEncounter(s, content)).toThrow(/fought first/);
  });
  it("ends the encounter without a draw when a fought monster survives", () => {
    const s = place(encounters(), "eh01/monster/cultist", "buenos-aires");
    const once = brawl(s, s.monsters.find((m) => m.id === "eh01/monster/cultist" && m.space === "buenos-aires")!);
    expect(() => drawEncounter(once, content, "general")).toThrow(/fought first/);
    expect(finishEncounter(once, content).phase).toMatchObject({ name: "encounter", active: lily });
  });
  it("discards the card to its deck's discard on finish", () => {
    const s = encounters();
    const card = s.decks.encounters.america![0]!;
    const next = finishEncounter(drawEncounter(s, content, "america"), content);
    expect(next.encounterDiscards.america).toEqual([card]);
    expect(next.phase).toEqual({ name: "encounter", active: lily, log: [], fought: [] });
  });
  it("moves the expedition token to the new top card's space", () => {
    const s = { ...encounters(), activeExpedition: "buenos-aires" };
    const next = finishEncounter(drawEncounter(s, content, "expedition"), content);
    const top = set.encounterDecks.find((d) => d.id === "expedition")!.cards.find((c) => c.id === next.decks.encounters.expedition![0])!;
    expect(board.spaces.find((sp) => sp.id === next.activeExpedition)!.name.en).toBe(top.name.replace(/ - \d+$/, ""));
  });
});

describe("an investigator at 0 health or sanity is defeated", () => {
  const lastStand = () => {
    const s = seedFor(place(patch(encounters(), leo, { sanity: 1 }), byakhee, "buenos-aires"), 0, undefined);
    return { ...s, doom: 12 };
  };
  it("is defeated by sanity: doom advances and the next seat encounters", () => {
    const s = lastStand();
    const next = brawl(s, s.monsters.find((m) => m.id === byakhee)!);
    expect(who(next, leo).defeated).toBe("sanity");
    expect(next.doom).toBe(11);
    expect(next.phase).toMatchObject({ name: "encounter", active: lily });
  });
  it("still lets a delayed investigator encounter", () => {
    expect(finishEncounter(patch(encounters(), lily, { delayed: true }), content).phase).toMatchObject({ name: "encounter", active: lily });
  });
  it("discards its improvement tokens", () => {
    const s = defeat(patch(encounters(), leo, { improvements: { lore: 1 } }), content, leo, "health");
    expect(who(s, leo).improvements).toEqual({});
  });
  it("lies in the nearest city with its conditions back in the deck", () => {
    const s = defeat(patch(encounters(), leo, { space: "space-2", conditions: ["eh01/condition/cursed-1"] }), content, leo, "health");
    expect(who(s, leo).space).toBe("san-francisco");
    expect(who(s, leo).conditions).toEqual([]);
    expect(s.decks.condition).toContain("eh01/condition/cursed-1");
  });
  it("passes the lead to the next seat", () => {
    expect(defeat(encounters(), content, leo, "health").leadInvestigator).toBe(lily);
  });
  const charlie = "eh01/investigator/charlie-kane";
  /** The resolved Mythos phase after Leo Anderson's defeat, his seat taken by Charlie Kane. */
  const replaced = () => replaceInvestigator(resolveMythos(finishEncounter(defeat(encounters(), content, leo, "health"), content), content), content, leo, charlie);
  it("is skipped in the Action phase and the Encounter phase", () => {
    const round2 = nextRound(replaced(), set);
    expect(round2.phase).toEqual({ name: "action", active: lily, taken: [] });
    const charlieTurn = endTurn(rest(round2, set));
    expect(charlieTurn.phase).toEqual({ name: "action", active: charlie, taken: [] });
    expect(endTurn(charlieTurn).phase).toEqual({ name: "encounter", active: lily, log: [], fought: [] });
  });
  it("refuses a defeated investigator as the lead", () => {
    expect(() => nextRound(replaced(), set, leo)).toThrow(/defeated/);
  });
  it("loses the game when every investigator is defeated", () => {
    const s = endTurn(game([leo]));
    expect(defeat(s, content, leo, "health").phase).toEqual({ name: "lost", reason: expect.stringMatching(/every investigator is defeated/) });
  });
});
