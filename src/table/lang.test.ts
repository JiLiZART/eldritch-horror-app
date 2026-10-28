import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { translate, spaceNameIn } from "./lang";
import { BOARD_SETS, PATH_COLORS } from "./sets";

const root = join(import.meta.dirname, "../..");
const en: Record<string, string> = JSON.parse(readFileSync(join(root, "content/panel/i18n/en.json"), "utf8"));
const ru: Record<string, string> = JSON.parse(readFileSync(join(root, "content/panel/i18n/ru.json"), "utf8"));

/** Every .tsx under src/table, recursively. */
function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? sources(p) : p.endsWith(".tsx") ? [p] : [];
  });
}

describe("the panel's strings", () => {
  it("hold the same keys in both languages", () => {
    expect(Object.keys(ru).sort()).toEqual(Object.keys(en).sort());
  });
  it("cover every key the components ask for", () => {
    const used = new Set(sources(join(root, "src/table")).flatMap((p) => [...readFileSync(p, "utf8").matchAll(/\bt\("([\w.]+)"/g)].map((m) => m[1]!)));
    expect(used.size).toBeGreaterThan(40);
    for (const key of used) {
      expect(en[key], `en ${key}`).toBeDefined();
      expect(ru[key], `ru ${key}`).toBeDefined();
    }
  });
  it("name every set, path type, space kind and region", () => {
    const keys = [...BOARD_SETS.map((id) => `set.${id}`), ...Object.keys(PATH_COLORS).map((p) => `path.${p}`), ...["city", "wilderness", "sea"].map((k) => `kind.${k}`), ...["america", "europe", "asia"].map((r) => `region.${r}`)];
    for (const key of keys) {
      expect(en[key], `en ${key}`).toBeDefined();
      expect(ru[key], `ru ${key}`).toBeDefined();
    }
  });
  it("fill placeholders", () => {
    expect(translate({ "a.b": "{name} has {n}" }, "a.b", { name: "Leo", n: 2 })).toBe("Leo has 2");
    expect(translate({}, "missing")).toBe("missing");
  });
});

describe("space names", () => {
  const board = { spaces: [{ id: "london", name: { en: "London", ru: "Лондон" } }] } as never;
  it("follow the language and fall back to the id", () => {
    expect(spaceNameIn(board, "en", "london")).toBe("London");
    expect(spaceNameIn(board, "ru", "london")).toBe("Лондон");
    expect(spaceNameIn(board, "ru", "nowhere")).toBe("nowhere");
  });
});
