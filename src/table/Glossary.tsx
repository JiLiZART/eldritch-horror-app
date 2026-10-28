import { useState } from "react";
import markdown from "../../content/rules/glossary.md?raw";
import { parseGlossary } from "../content/glossary";
import { useT } from "./lang";

const SECTIONS = parseGlossary(markdown);

/** The rules glossary beside the board (design D3): folded, filtered by a word in either language. */
export function Glossary() {
  const [filter, setFilter] = useState("");
  const t = useT();
  const words = filter.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (haystack: string) => words.every((w) => haystack.toLowerCase().includes(w));
  const sections = SECTIONS.map((s) => ({ ...s, entries: s.entries.filter((e) => matches(`${e.en} ${e.ru} ${e.text}`)) })).filter((s) => s.entries.length > 0);
  return (
    <details className="glossary">
      <summary>{t("panel.glossary")}</summary>
      <input type="search" aria-label={t("panel.filterGlossary")} placeholder={t("panel.filterGlossary")} value={filter} onChange={(e) => setFilter(e.target.value)} />
      {sections.map((s) => (
        <section key={s.section}>
          <h3>{s.section}</h3>
          <dl>
            {s.entries.map((e) => (
              <div key={e.en}>
                <dt>
                  {e.en} / {e.ru}
                  {e.unofficial && ` ${t("glossary.unofficial")}`}
                </dt>
                <dd>
                  {e.text} <small>{e.source}</small>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </details>
  );
}
