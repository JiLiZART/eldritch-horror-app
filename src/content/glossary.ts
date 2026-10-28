/** The rules glossary parsed from `content/rules/glossary.md` (design D1): sections of bilingual, sourced entries. */

export interface GlossaryEntry {
  en: string;
  ru: string;
  /** Expansion term absent from the core reference guide. */
  unofficial: boolean;
  text: string;
  source: string;
}

export interface GlossarySection {
  section: string;
  entries: GlossaryEntry[];
}

export function parseGlossary(markdown: string): GlossarySection[] {
  const sections: GlossarySection[] = [];
  let entry: GlossaryEntry | undefined;
  for (const raw of markdown.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("## ")) {
      sections.push({ section: line.slice(3), entries: [] });
      entry = undefined;
    } else if (line.startsWith("### ")) {
      const unofficial = line.includes("*(unofficial)*");
      const [en = "", ru = ""] = line.slice(4).replace("*(unofficial)*", "").split(" / ").map((s) => s.trim());
      entry = { en, ru, unofficial, text: "", source: "" };
      sections.at(-1)?.entries.push(entry);
    } else if (entry && line.startsWith("Source:")) {
      entry.source = line.slice(7).trim();
    } else if (entry && line) {
      entry.text = entry.text ? `${entry.text} ${line}` : line;
    }
  }
  return sections;
}
