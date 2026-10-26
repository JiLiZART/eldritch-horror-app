import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadSet } from "./load";

describe("core set", () => {
  const { investigators, ancientOnes, monsters, mythos, encounterDecks: decks } = loadSet(join(import.meta.dirname, "../../content/sets/eh01"))!;

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

  it("records printed Ancient One setup", () => {
    const byName = (n: string) => ancientOnes.find((a) => a.name === n)!;
    expect(byName("Cthulhu").setup?.setAsideMonsters).toEqual({ "eh01/monster/deep-one": 1, "eh01/monster/star-spawn": 1 });
    expect(byName("Shub-Niggurath").setup?.setAsideMonsters).toEqual({ "eh01/monster/ghoul": 2, "eh01/monster/goat-spawn": 2, "eh01/monster/dark-young": 1 });
    expect(byName("Azathoth").setup?.eldritchTokensOnOmen).toBe(1);
    expect(byName("Yog-Sothoth").setup).toBeUndefined();
  });

  it("records monster token counts and spawn relocation", () => {
    const byName = (n: string) => monsters.find((m) => m.name === n)!;
    expect(byName("Cultist").count).toBe(5);
    expect(byName("Ghoul").count).toBe(2);
    expect(byName("Goat Spawn").count).toBe(2);
    expect(monsters.filter((m) => !m.epic).reduce((n, m) => n + (m.count ?? 1), 0)).toBe(34);
    expect(byName("Color Out of Space").spawnMoveTo).toBe("tunguska");
    expect(byName("Cultist").spawnMoveTo).toBeUndefined();
  });

  it("records the printed trait and icon row of every mythos card", () => {
    const card = mythos.find((m) => m.id === "eh01/mythos/green/a-proposition")!;
    expect(card.trait).toBe("event");
    expect(card.effects).toEqual(["advance-omen", "reckoning", "spawn-clues"]);
    for (const m of mythos) expect(m.effects.length, m.id).toBeGreaterThan(0);
  });
});
