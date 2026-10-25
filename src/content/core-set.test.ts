import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "./load";

describe("core set", () => {
  const { investigators, ancientOnes, encounterDecks: decks } = loadSet(join(import.meta.dirname, "../../content/sets/eh01"))!;

  it("has 12 investigators and 4 Ancient Ones", () => {
    expect(investigators).toHaveLength(12);
    expect(ancientOnes).toHaveLength(4);
  });

  it("has the six core encounter decks", () => {
    expect(decks.map((d) => d.id).sort()).toEqual(
      ["america", "asia", "europe", "expedition", "general", "other-world"],
    );
  });

  it("records Akachi Onyele's sheet", () => {
    const akachi = investigators.find((i) => i.name === "Akachi Onyele")!;
    expect(akachi.health).toBe(5);
    expect(akachi.sanity).toBe(7);
    expect(akachi.startingSpace).toBe("space-15");
    expect(akachi.starting.clues).toBe(1);
    expect(akachi.starting.spells).toContain("eh01/spell/mists-of-releh");
    expect(Object.keys(akachi.skills).sort()).toEqual(["influence", "lore", "observation", "strength", "will"]);
  });

  it("gives every Ancient One three mythos stages with three color counts", () => {
    for (const ao of ancientOnes) {
      expect(ao.doom).toBeGreaterThan(0);
      for (const stage of [ao.mythos.stage1, ao.mythos.stage2, ao.mythos.stage3]) {
        expect(Object.keys(stage).sort()).toEqual(["blue", "green", "yellow"]);
        for (const n of Object.values(stage)) expect(typeof n).toBe("number");
      }
    }
  });
});
