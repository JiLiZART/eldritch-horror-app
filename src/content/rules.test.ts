import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const enums = JSON.parse(readFileSync(new URL("../../content/rules/enums.json", import.meta.url), "utf8")) as {
  phases: string[];
  actions: { id: string; set: string }[];
  skills: string[];
  combatSteps: string[];
};

describe("rules enums", () => {
  it("lists phases in order", () => {
    expect(enums.phases).toEqual(["action", "encounter", "mythos"]);
  });
  it("lists core actions and gates expansion actions", () => {
    const core = enums.actions.filter((a) => a.set === "eh01").map((a) => a.id);
    for (const id of ["travel", "rest", "trade", "prepare-for-travel", "acquire-assets", "component-action"]) {
      expect(core).toContain(id);
    }
    for (const id of ["focus", "gather-resources"]) {
      const action = enums.actions.find((a) => a.id === id);
      expect(action?.set).toBeDefined();
      expect(action?.set).not.toBe("eh01");
    }
  });
  it("lists exactly five skills", () => {
    expect(enums.skills).toEqual(["lore", "influence", "observation", "strength", "will"]);
  });
  it("lists combat steps in order", () => {
    expect(enums.combatSteps).toEqual(["check-monster-effects", "will-test", "strength-test"]);
  });
});
