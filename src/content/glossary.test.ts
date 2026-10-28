import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseGlossary } from "./glossary";

const markdown = readFileSync(join(import.meta.dirname, "../../content/rules/glossary.md"), "utf8");

describe("parseGlossary", () => {
  const sections = parseGlossary(markdown);
  const entries = sections.flatMap((s) => s.entries);
  it("reads every entry under its section in order", () => {
    expect(entries).toHaveLength(69);
    expect(sections.map((s) => s.section)).toEqual(["Round structure", "Actions", "Encounters", "Tests and skills", "Investigator state", "Board", "Tokens and tracks", "Ancient One and victory", "Expansion terms"]);
  });
  it("keeps both names, the text and the source", () => {
    const delayed = sections.find((s) => s.section === "Investigator state")?.entries.find((e) => e.en === "Delayed");
    expect(delayed).toMatchObject({ ru: "Задержанный сыщик", unofficial: false, source: "manual_eng.pdf p.4; EH_reference.pdf p.4" });
    expect(delayed?.text).toMatch(/^Token laid on its side/);
  });
  it("marks unofficial expansion terms", () => {
    expect(entries.find((e) => e.en === "Focus")).toMatchObject({ ru: "Концентрация", unofficial: true });
  });
});
