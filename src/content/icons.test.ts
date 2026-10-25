import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { iconPath } from "./icons";
import type { IconManifest } from "./types";
import { validateIcons } from "./validate";

const manifest = JSON.parse(readFileSync("content/icons/manifest.json", "utf8")) as IconManifest;
const files = readdirSync("public/icons").map((f) => `icons/${f}`);

describe("icon set", () => {
  it("manifest matches the icons directory", () => {
    expect(validateIcons(manifest, files)).toEqual([]);
  });
  it("clue icon has transparent corners", () => {
    const file = `public/${iconPath(manifest, "clue")}`;
    const alpha = execSync(`magick "${file}" -format "%[fx:p{0,0}.a] %[fx:p{w-1,h-1}.a]" info:`).toString().trim();
    expect(alpha).toBe("0 0");
  });
  it("unknown icon name throws", () => {
    expect(() => iconPath(manifest, "nope")).toThrow("nope");
  });
  it("dice entry is an SVG", () => {
    expect(manifest.dice.file).toMatch(/\.svg$/);
    expect(files).toContain(manifest.dice.file);
  });
  it("names the expected icons", () => {
    for (const n of ["clue", "gate", "expedition", "rumor", "reckoning", "eldritch", "lore", "influence", "observation", "strength", "will"]) {
      expect(manifest.icons[n], n).toBeDefined();
    }
  });
});
