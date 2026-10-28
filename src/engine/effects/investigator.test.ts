import { describe, expect, it } from "vitest";
import { finishEncounter } from "../encounter";
import { resolveMythos } from "../mythos";
import { note } from "../spawn";
import type { GameState } from "../types";
import { changeHealth, changeSanity, clueTokensLeft, delay, devour, discardImprovement, gainClue, improveSkill, moveInvestigator, moveInvestigatorRandomly, moveInvestigatorToNearest, nearestSpaces, spawnMonsterRandomly, spendClue, spendHealth, spendSanity, standUp } from "../effects";
import { set, content, leo, lily, game, who, patch, encounters, log, cardName, encountersLog } from "./fixture";

describe("card text is applied in the Encounter and Mythos phases", () => {
  it("logs in the Encounter phase", () => {
    expect(log(note(encounters(), "a line"))).toBe("a line");
  });
  it("logs the effect in rule words", () => {
    expect(log(gainClue(encounters(), content, leo))).toMatch(/Leo Anderson gains 1 clue/);
  });
  it("is refused in the Action phase", () => {
    expect(() => changeHealth(game(), content, leo, -1)).toThrow(/Encounter and Mythos/);
  });
  it("waits for the mythos card to be resolved", () => {
    const mythos = finishEncounter(finishEncounter(encounters(), content), content);
    expect(() => spendClue(mythos, content, leo)).toThrow(/resolved/);
    const s = changeSanity(resolveMythos(mythos, content), content, leo, -1);
    expect(who(s, leo).sanity).toBe(5);
    expect(log(s)).toMatch(/loses 1 sanity/);
  });
  it("is refused on a defeated investigator", () => {
    expect(() => changeHealth(patch(encounters(), leo, { defeated: "health" }), content, leo, 1)).toThrow(/defeated/);
  });
});

describe("health and sanity change by card text", () => {
  it("gains up to the sheet maximum", () => {
    expect(who(changeHealth(patch(encounters(), leo, { health: 5 }), content, leo, 2), leo).health).toBe(6);
  });
  it("defeats at 0 in the Mythos phase too", () => {
    const mythos = resolveMythos(finishEncounter(finishEncounter(encounters(), content), content), content);
    const s = changeHealth(patch(mythos, leo, { health: 1 }), content, leo, -1);
    expect(who(s, leo).defeated).toBe("health");
    expect(log(s)).toMatch(/Leo Anderson is defeated and lies on Buenos Aires/);
  });
  it("defeats at 0", () => {
    const s = changeSanity(patch(encounters(), lily, { sanity: 2 }), content, lily, -2);
    expect(who(s, lily).defeated).toBe("sanity");
    expect(s.doom).toBe(14);
  });
});

describe("spending health or sanity never defeats", () => {
  it("takes the cost like a loss and logs it", () => {
    const s = spendHealth(patch(encounters(), leo, { health: 3 }), content, leo, 1);
    expect(who(s, leo).health).toBe(2);
    expect(log(s)).toMatch(/Leo Anderson spends 1 health/);
    expect(who(spendSanity(patch(encounters(), leo, { sanity: 2 }), content, leo, 1), leo).sanity).toBe(1);
  });
  it("refuses the last point", () => {
    expect(() => spendSanity(patch(encounters(), leo, { sanity: 1 }), content, leo, 1)).toThrow(/cannot spend their last sanity/);
  });
});

describe("clues are gained and spent", () => {
  it("takes the token on the space first", () => {
    const s = gainClue({ ...encounters(), clues: ["shanghai"] }, content, lily);
    expect(who(s, lily).clues).toBe(1);
    expect(s.clues).not.toContain("shanghai");
    expect(log(s)).toMatch(/Shanghai/);
  });
  it("takes the top of the pool otherwise", () => {
    const before = encounters();
    const s = gainClue(before, content, leo);
    expect(who(s, leo).clues).toBe(1);
    expect(s.cluePool).toEqual(before.cluePool.slice(1));
  });
  it("reshuffles the discard into an empty pool", () => {
    const s = gainClue({ ...encounters(), cluePool: [], clueDiscard: ["rome", "london"] }, content, leo);
    expect(s.cluePool).toHaveLength(1);
    expect(s.clueDiscard).toEqual([]);
  });
  it("is refused with no clue anywhere", () => {
    expect(() => gainClue({ ...encounters(), cluePool: [], clueDiscard: [] }, content, leo)).toThrow(/no clue can be gained/);
  });
  it("spends one and refuses with none", () => {
    expect(who(spendClue({ ...patch(encounters(), leo, { clues: 1 }), heldClues: ["arkham"] }, content, leo), leo).clues).toBe(0);
    expect(() => spendClue(encounters(), content, leo)).toThrow(/holds no clue/);
  });
});

describe("spent clues join the clue discard", () => {
  it("keeps a gained token in the held list", () => {
    const before = encounters();
    const s = gainClue(before, content, leo);
    expect(s.heldClues).toEqual([...before.heldClues, before.cluePool[0]]);
  });
  it("keeps the clue discard when the pool still has tokens", () => {
    const before = { ...encounters(), clueDiscard: ["arkham"] };
    expect(gainClue(before, content, leo).clueDiscard).toEqual(["arkham"]);
  });
  it("moves a spent token to the discard with the pool unchanged", () => {
    const before = gainClue(encounters(), content, leo);
    const s = spendClue(before, content, leo);
    expect(s.clueDiscard).toEqual([before.heldClues.at(-1)]);
    expect(s.heldClues).toEqual(before.heldClues.slice(0, -1));
    expect(s.cluePool).toEqual(before.cluePool);
  });
  it("moves a devoured investigator's tokens", () => {
    const before = gainClue(gainClue(encounters(), content, leo), content, leo);
    const s = devour(before, content, leo);
    expect(s.clueDiscard).toHaveLength(before.clueDiscard.length + who(before, leo).clues);
    expect(s.heldClues).toHaveLength(before.heldClues.length - who(before, leo).clues);
  });
});

describe("an investigator is moved to the nearest space", () => {
  it("moves to the nearest city, the players choosing among the three that tie from Space 2", () => {
    const s = moveInvestigatorToNearest(patch(encounters(), leo, { space: "space-2" }), content, leo, "city", "san-francisco");
    expect(who(s, leo).space).toBe("san-francisco");
    expect(log(s)).toMatch(/Leo Anderson moves to San Francisco/);
  });
  it("stays when already on a matching space", () => {
    const s = moveInvestigatorToNearest(encounters(), content, leo, "city");
    expect(who(s, leo).space).toBe("buenos-aires");
    expect(log(s)).toMatch(/Leo Anderson is already on the nearest city/);
  });
  it("asks the players to choose among tied nearest spaces and takes their pick", () => {
    const tied = patch(encounters(), leo, { space: "the-amazon" });
    expect(nearestSpaces(tied, content, leo, "city")).toEqual(["buenos-aires", "space-7"]);
    expect(() => moveInvestigatorToNearest(tied, content, leo, "city")).toThrow(/choose among the nearest city spaces: Buenos Aires, Space 7/);
    expect(() => moveInvestigatorToNearest(tied, content, leo, "city", "london")).toThrow(/choose among/);
    expect(who(moveInvestigatorToNearest(tied, content, leo, "city", "space-7"), leo).space).toBe("space-7");
  });
  it("finds the nearest gate and refuses with nothing matching", () => {
    const s = moveInvestigatorToNearest({ ...encounters(), gates: ["london"] }, content, leo, "gate");
    expect(who(s, leo).space).toBe("london");
    expect(() => moveInvestigatorToNearest({ ...encounters(), clues: [] }, content, leo, "clue")).toThrow(/no space with a clue exists/);
  });
});

describe("card text ends the delay early", () => {
  it("stands a delayed investigator up", () => {
    const s = standUp(delay(encounters(), content, leo), content, leo);
    expect(who(s, leo).delayed).toBeUndefined();
    expect(log(s)).toMatch(/Leo Anderson stands up/);
  });
  it("refuses when not delayed", () => {
    expect(() => standUp(encounters(), content, leo)).toThrow(/is not delayed/);
  });
});

describe("card text delays an investigator", () => {
  it("marks the investigator delayed and logs it", () => {
    const s = delay(encounters(), content, leo);
    expect(who(s, leo).delayed).toBe(true);
    expect(log(s)).toMatch(/Leo Anderson is delayed/);
  });
  it("refuses an already delayed investigator", () => {
    expect(() => delay(delay(encounters(), content, leo), content, leo)).toThrow(/already delayed/);
  });
});

describe("a skill is improved by card text", () => {
  it("improves to +1 and logs it", () => {
    const s = improveSkill(encounters(), content, leo, "lore");
    expect(who(s, leo).improvements).toEqual({ lore: 1 });
    expect(log(s)).toMatch(/Leo Anderson improves Lore to \+1/);
  });
  it("flips to +2", () => {
    expect(who(improveSkill(patch(encounters(), leo, { improvements: { lore: 1 } }), content, leo, "lore"), leo).improvements).toEqual({ lore: 2 });
  });
  it("refuses a third improvement", () => {
    expect(() => improveSkill(patch(encounters(), leo, { improvements: { lore: 2 } }), content, leo, "lore")).toThrow(/at most twice/);
  });
  it("discards one step", () => {
    const s = discardImprovement(patch(encounters(), leo, { improvements: { lore: 2 } }), content, leo, "lore");
    expect(who(s, leo).improvements).toEqual({ lore: 1 });
    expect(who(discardImprovement(s, content, leo, "lore"), leo).improvements).toEqual({});
  });
  it("refuses to discard what is not there", () => {
    expect(() => discardImprovement(encounters(), content, leo, "lore")).toThrow(/Lore is not improved/);
  });
});

describe("an investigator is moved by card text", () => {
  it("refuses a Detained investigator", () => {
    expect(() => moveInvestigator(patch(encounters(), leo, { conditions: ["eh01/condition/detained-1"] }), content, leo, "arkham")).toThrow(/Detained investigator cannot move/);
  });
  it("moves to the named space", () => {
    const s = moveInvestigator(encounters(), content, leo, "arkham");
    expect(who(s, leo).space).toBe("arkham");
    expect(log(s)).toMatch(/Leo Anderson moves to Arkham/);
  });
  it("refuses an unknown space, naming it", () => {
    expect(() => moveInvestigator(encounters(), content, leo, "nope")).toThrow(/nope/);
  });
});

describe("a devoured investigator leaves the game", () => {
  const muscle = who(encounters(), leo).possessions.find((c) => cardName(c) === "Hired Muscle")!;
  it("discards everything, advances doom and passes the encounter", () => {
    const s = devour({ ...patch(encounters(), leo, { clues: 1, improvements: { lore: 1 } }), heldClues: ["arkham"], doom: 12 }, content, leo);
    expect(s.doom).toBe(11);
    expect(s.assetDiscard).toContain(muscle);
    expect(who(s, leo)).toMatchObject({ defeated: "devoured", clues: 0, possessions: [], conditions: [], improvements: {}, tickets: [] });
    expect(s.phase).toMatchObject({ name: "encounter", active: lily });
    expect(log(encountersLog(s))).toBe("");
  });
  it("logs it and passes the lead", () => {
    const before = { ...encounters(), doom: 12 };
    const s = devour(before, content, leo);
    expect(s.leadInvestigator).toBe(lily);
  });
  it("loses the game when the last standing investigator is devoured", () => {
    const s = devour(patch(encounters(), lily, { defeated: "health" }), content, leo);
    expect(s.phase).toEqual({ name: "lost", reason: expect.stringMatching(/Leo Anderson is devoured/) });
  });
});

describe("a random space is drawn from the clue pool", () => {
  const topLondon = (s: GameState): GameState => ({ ...s, cluePool: ["london", ...s.cluePool.filter((c) => c !== "london")] });
  it("lets the lead name the random spawn space once no clue token is left", () => {
    const bare = { ...encounters(), cluePool: [], clueDiscard: [] };
    expect(() => spawnMonsterRandomly(bare, content, leo)).toThrow(/the lead investigator chooses the space/);
    const s = spawnMonsterRandomly(bare, content, leo, "tokyo");
    expect(s.monsters.some((m) => m.space === "tokyo")).toBe(true);
    expect(log(s)).toMatch(/no clue token is left, so the lead investigator names Tokyo/);
    expect(spawnMonsterRandomly(topLondon(encounters()), content, leo, "tokyo").monsters.some((m) => m.space === "london")).toBe(true);
  });
  it("lets the lead name the space once no clue token is left, and ignores the name while one is", () => {
    const bare = { ...encounters(), cluePool: [], clueDiscard: [] };
    expect(clueTokensLeft(bare)).toBe(false);
    expect(clueTokensLeft(encounters())).toBe(true);
    expect(() => moveInvestigatorRandomly(bare, content, leo)).toThrow(/the lead investigator chooses the space/);
    const chosen = moveInvestigatorRandomly(bare, content, leo, "tokyo");
    expect(who(chosen, leo).space).toBe("tokyo");
    expect(log(chosen)).toMatch(/no clue token is left, so the lead investigator names Tokyo/);
    expect(who(moveInvestigatorRandomly(topLondon(encounters()), content, leo, "tokyo"), leo).space).toBe("london");
  });
  it("moves the investigator to the top clue token's space and discards the token", () => {
    const s = moveInvestigatorRandomly(topLondon(encounters()), content, leo);
    expect(who(s, leo).space).toBe("london");
    expect(s.clueDiscard).toEqual(["london"]);
    expect(s.cluePool).not.toContain("london");
    expect(log(s)).toMatch(/a clue token names London as the random space/);
  });
  it("spawns a monster on the drawn space or where its back sends it", () => {
    const before = topLondon(encounters());
    const sheet = set.monsters.find((m) => m.id === before.monsterCup[0]!.id)!;
    const s = spawnMonsterRandomly(before, content, leo);
    expect(s.monsters.at(-1)?.space).toBe(sheet.spawnMoveTo ?? "london");
    expect(s.clueDiscard).toEqual(["london"]);
  });
  it("rebuilds an empty pool from the discard first", () => {
    const s = moveInvestigatorRandomly({ ...encounters(), cluePool: [], clueDiscard: ["arkham"] }, content, leo);
    expect(who(s, leo).space).toBe("arkham");
    expect(s.clueDiscard).toEqual(["arkham"]);
  });
  it("refuses with no token anywhere", () => {
    expect(() => moveInvestigatorRandomly({ ...encounters(), cluePool: [], clueDiscard: [] }, content, leo)).toThrow(/lead investigator chooses the space/);
  });
});
