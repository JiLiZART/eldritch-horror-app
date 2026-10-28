import { useState, type ReactNode } from "react";
import { neighbors } from "../content/board";
import type { Board, GameSet, Lang, Space } from "../content/types";
import { OMEN_TRACK } from "../engine/omen";
import type { GameState } from "../engine/types";
import { Glossary } from "./Glossary";
import { useSpaceName, useT } from "./lang";
import type { Piece } from "./pieces";
import { BOARD_SETS, PATH_COLORS } from "./sets";

interface PanelProps {
  board: Board;
  set: GameSet;
  state: GameState | undefined;
  /** Language of the text printed on the board. */
  lang: Lang;
  onLang: (lang: Lang) => void;
  pieces: Map<string, Piece[]>;
  spaces: Space[];
  enabled: Set<string>;
  onToggle: (id: string, on: boolean) => void;
  selected: Space | undefined;
  onSelect: (id: string) => void;
  children?: ReactNode;
}

/** Board set names beyond the core set, as the content names them; the core set's name is a panel string (deck-names-language D1). */
const SET_NAMES: Record<string, string> = Object.fromEntries(BOARD_SETS.map((s) => [s.id, s.name]));

export function Panel({ board, set, state, lang, onLang, pieces, spaces, enabled, onToggle, selected, onSelect, children }: PanelProps) {
  const t = useT();
  const spaceName = useSpaceName();
  const pathType = (a: string, b: string) => board.paths.find((p) => (p.from === a && p.to === b) || (p.from === b && p.to === a))?.type;
  return (
    <aside className="panel">
      <h1>Eldritch Horror</h1>
      {children}
      {state && <Status board={board} set={set} state={state} onSelect={onSelect} />}
      {state && <Journal set={set} state={state} />}
      <Glossary />
      <fieldset>
        <legend>{t("panel.boardLanguage")}</legend>
        {(["en", "ru"] as const).map((l) => (
          <label key={l}>
            <input type="radio" name="board-lang" checked={lang === l} onChange={() => onLang(l)} /> {l === "en" ? "English" : "Русский"}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t("panel.sets")}</legend>
        <label>
          <input type="checkbox" checked disabled /> {t("set.eh01")}
        </label>
        {BOARD_SETS.map((s) => (
          <label key={s.id}>
            <input type="checkbox" checked={enabled.has(s.id)} onChange={(e) => onToggle(s.id, e.target.checked)} /> {s.name}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t("panel.paths")}</legend>
        {Object.entries(PATH_COLORS).map(([type, color]) => (
          <span key={type} className="swatch">
            <i style={{ background: color }} /> {type}
          </span>
        ))}
      </fieldset>
      <section aria-live="polite">
        <h2>{t("panel.selectedSpace")}</h2>
        {selected ? (
          <dl>
            <dt>{t("space.id")}</dt>
            <dd>{selected.id}</dd>
            <dt>{t("space.name")}</dt>
            <dd>
              {selected.name.en} / {selected.name.ru}
            </dd>
            <dt>{t("space.kind")}</dt>
            <dd>{selected.kind}</dd>
            <dt>{t("space.region")}</dt>
            <dd>{selected.region ?? t("space.none")}</dd>
            <dt>{t("space.set")}</dt>
            <dd>{selected.set === "eh01" ? t("set.eh01") : SET_NAMES[selected.set]}</dd>
            <dt>{t("space.pieces")}</dt>
            <dd>{pieces.get(selected.id)?.map((p) => p.label).join(", ") ?? t("space.none")}</dd>
            <dt>{t("space.neighbours")}</dt>
            <dd>
              <ul>
                {neighbors(board, selected.id).map((n) => (
                  <li key={n}>
                    <button type="button" onClick={() => onSelect(n)}>
                      {spaceName(board, n)}
                    </button>{" "}
                    <small>{pathType(selected.id, n)}</small>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        ) : (
          <p>{t("space.pick")}</p>
        )}
      </section>
      <section>
        <h2>{t("panel.spaces")}</h2>
        <ul className="spaces">
          {spaces.map((s) => (
            <li key={s.id}>
              <button type="button" aria-pressed={s.id === selected?.id} onClick={() => onSelect(s.id)}>
                {spaceName(board, s.id)}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

/** The game's record beside the board (design D4): folded, grouped by round, oldest first. */
function Journal({ set, state }: { set: GameSet; state: GameState }) {
  const t = useT();
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  const text = (line: string) => (line.startsWith("component:") ? t("journal.component", { name: set.cards.find((c) => c.id === line.slice(10))?.name ?? name(line.slice(10)) }) : line);
  const rounds = [...new Set(state.journal.map((e) => e.round))];
  return (
    <details className="journal">
      <summary>{t("panel.journal", { count: state.journal.length })}</summary>
      {rounds.map((round) => (
        <section key={round}>
          <h3>{t("panel.round", { round })}</h3>
          <ol>
            {state.journal
              .filter((e) => e.round === round)
              .map((e, n) => (
                <li key={n}>
                  {t(`journal.${e.phase}`)}
                  {e.who && `, ${name(e.who)}`}: {text(e.text)}
                </li>
              ))}
          </ol>
        </section>
      ))}
    </details>
  );
}

function Status({ board, set, state, onSelect }: { board: Board; set: GameSet; state: GameState; onSelect: (id: string) => void }) {
  const t = useT();
  /** The one investigator whose sheet image is open (design D2). */
  const [sheet, setSheet] = useState<string>();
  const SKILLS = ["lore", "influence", "observation", "strength", "will"] as const;
  const ancientOne = set.ancientOnes.find((a) => a.id === state.ancientOne);
  const mystery = ancientOne?.mysteries.find((m) => m.id === state.currentMystery);
  const cardName = (id: string) => set.cards.find((c) => c.id === id)?.name ?? id;
  const spaceName = useSpaceName();
  const { encounters, ...decks } = state.decks;
  const sizes = Object.entries({ ...decks, ...encounters, monsterCup: state.monsterCup, setAside: state.setAsideMonsters, gateStack: state.gateStack, cluePool: state.cluePool });
  const ongoing = state.ongoingMythos.map((id) => set.mythos.find((m) => m.id === id)).filter((m) => m !== undefined);
  return (
    <section className="status">
      <h2>
        {ancientOne?.name ?? state.ancientOne}
        {state.awakened && t("status.awakened")}
      </h2>
      <dl>
        <dt>{t("status.doom")}</dt>
        <dd>
          {state.doom}
        </dd>
        <dt>{t("status.omen")}</dt>
        <dd>{t("status.omenLine", { omen: t(`omen.${OMEN_TRACK[state.omen]}`), count: state.eldritchOnOmen[state.omen] ?? 0 })}</dd>
        <dt>{t("status.referenceCard")}</dt>
        <dd>{t("status.referenceLine", { gates: state.referenceCard.gates, clues: state.referenceCard.clues, surge: state.referenceCard.surge })}</dd>
        <dt>{t("status.mystery")}</dt>
        <dd className="cards">
          {mystery && <img src={`/${mystery.images.front}`} alt={mystery.name} />}
          {state.awakened && ancientOne?.images.back && <img src={`/${ancientOne.images.back}`} alt={`${ancientOne.name} awakened`} />}
          {t("status.mysteryLine", { solved: state.solvedMysteries.length, tokens: state.mysteryTokens })}
          {state.finalMysterySolved && t("status.finalSolved")}
        </dd>
        <dt>{t("status.reserve")}</dt>
        <dd className="cards">
          {state.reserve.map((id) => {
            const card = set.cards.find((c) => c.id === id);
            return (
              card && (
                <figure key={id}>
                  <img src={`/${card.images.front}`} alt={card.name} />
                  <figcaption>{t("status.value", { value: card.value ?? 0 })}</figcaption>
                </figure>
              )
            );
          })}
        </dd>
        <dt>{t("status.ongoing")}</dt>
        <dd className="cards">
          {ongoing.map((m) => (
            <img key={m.id} src={`/${m.images.front}`} alt={m.name} />
          ))}
        </dd>
        <dt>{t("status.decks")}</dt>
        <dd>{sizes.map(([name, cards]) => `${t(`deck.${name}`)} ${cards.length}`).join(", ")}</dd>
      </dl>
      <table>
        <thead>
          <tr>
            <th>{t("status.investigator")}</th>
            <th>{t("status.space")}</th>
            <th>{t("status.health")}</th>
            <th>{t("status.sanity")}</th>
            <th>{t("status.clues")}</th>
            <th>{t("status.tickets")}</th>
            <th>{t("status.possessions")}</th>
            <th>{t("status.conditions")}</th>
            <th>{t("status.skills")}</th>
          </tr>
        </thead>
        <tbody>
          {state.investigators.map((i) => {
            const printed = set.investigators.find((x) => x.id === i.id);
            return (
            <tr key={i.id}>
              <td>
                {i.id === state.leadInvestigator && <span title={t("status.lead")}>★ </span>}
                {printed?.name ?? i.id}
                {i.defeated && ` (${i.defeated === "devoured" ? t("status.devoured") : t("status.defeatedBy", { cause: t(`cause.${i.defeated}`) })}${i.removed ? t("status.removed") : ""}${i.replacedBy ? t("status.replacedBy", { name: set.investigators.find((x) => x.id === i.replacedBy)?.name ?? i.replacedBy }) : ""})`}
                {i.delayed && t("status.delayed")}{" "}
                <button type="button" onClick={() => setSheet(sheet === i.id ? undefined : i.id)}>
                  {sheet === i.id ? t("status.hideSheet") : t("status.showSheet")}
                </button>
                {sheet === i.id && printed && (
                  <p className="cards">
                    <img className="held-card" src={`/${printed.images.front}`} alt={`${printed.name} sheet`} />
                  </p>
                )}
              </td>
              <td>
                {/* Selecting the space glides the view to the pawn (status-space-select D1). */}
                <button type="button" onClick={() => onSelect(i.space)}>
                  {spaceName(board, i.space)}
                </button>
              </td>
              <td>{i.health}</td>
              <td>{i.sanity}</td>
              <td>{i.clues}</td>
              <td>{i.tickets.map((x) => t(`ticket.${x}`)).join(", ")}</td>
              <td>{i.possessions.map(cardName).join(", ")}</td>
              <td>{i.conditions.map(cardName).join(", ")}</td>
              <td>{printed && SKILLS.map((k) => `${t(`skill.${k}`)} ${printed.skills[k] + (i.improvements[k] ?? 0)}`).join(", ")}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
