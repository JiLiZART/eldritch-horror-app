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
  /** Hides the panel for a table-only screen (panel-toggle D1). */
  onHidePanel: () => void;
  /** Brings a card up on the table by its place (panel-card-focus D2). */
  onFocusCard: FocusCard;
  children?: ReactNode;
}

export type FocusCard = (place: "reserve" | "mystery" | "mythos" | "sheet" | "held", index: number, seat?: number) => void;

/** Board set names beyond the core set, as the content names them; the core set's name is a panel string (deck-names-language D1). */
const SET_NAMES: Record<string, string> = Object.fromEntries(BOARD_SETS.map((s) => [s.id, s.name]));

export function Panel({ board, set, state, lang, onLang, pieces, spaces, enabled, onToggle, selected, onSelect, onHidePanel, onFocusCard, children }: PanelProps) {
  const t = useT();
  const spaceName = useSpaceName();
  /** Text narrowing the space list by name in the chosen language (space-filter D1). */
  const [filter, setFilter] = useState("");
  const shown = spaces.filter((s) => spaceName(board, s.id).toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  const pathType = (a: string, b: string) => board.paths.find((p) => (p.from === a && p.to === b) || (p.from === b && p.to === a))?.type;
  return (
    <aside className="panel">
      <h1>
        Eldritch Horror{" "}
        <button type="button" onClick={onHidePanel}>
          {t("game.hidePanel")}
        </button>
      </h1>
      {children}
      {state && <Status board={board} set={set} state={state} onSelect={onSelect} onFocusCard={onFocusCard} />}
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
        <input type="search" aria-label={t("panel.filterSpaces")} placeholder={t("panel.filterSpaces")} value={filter} onChange={(e) => setFilter(e.target.value)} />
        <ul className="spaces">
          {shown.map((s) => (
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

function Status({ board, set, state, onSelect, onFocusCard }: { board: Board; set: GameSet; state: GameState; onSelect: (id: string) => void; onFocusCard: FocusCard }) {
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
          {mystery && (
            <button type="button" className="card-button" onClick={() => onFocusCard("mystery", 0)}>
              <img src={`/${mystery.images.front}`} alt={mystery.name} />
            </button>
          )}
          {state.awakened && ancientOne?.images.back && <img src={`/${ancientOne.images.back}`} alt={`${ancientOne.name} awakened`} />}
          {t("status.mysteryLine", { solved: state.solvedMysteries.length, tokens: state.mysteryTokens })}
          {state.finalMysterySolved && t("status.finalSolved")}
        </dd>
        <dt>{t("status.reserve")}</dt>
        <dd className="cards">
          {state.reserve.map((id, n) => {
            const card = set.cards.find((c) => c.id === id);
            return (
              card && (
                <figure key={id}>
                  <button type="button" className="card-button" onClick={() => onFocusCard("reserve", n)}>
                    <img src={`/${card.images.front}`} alt={card.name} />
                  </button>
                  <figcaption>{t("status.value", { value: card.value ?? 0 })}</figcaption>
                </figure>
              )
            );
          })}
        </dd>
        <dt>{t("status.ongoing")}</dt>
        <dd className="cards">
          {ongoing.map((m, n) => (
            <button key={m.id} type="button" className="card-button" onClick={() => onFocusCard("mythos", state.phase.name === "mythos" ? n + 1 : n)}>
              <img src={`/${m.images.front}`} alt={m.name} />
            </button>
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
            const seat = state.investigators.filter((x) => !x.removed).findIndex((x) => x.id === i.id);
            /** The held cards' names as buttons bringing each card up under the sheet; `offset` counts the possessions laid before the conditions (held-card-focus D2). */
            const heldButtons = (ids: string[], offset: number) =>
              ids.map((id, n) => (
                <span key={id}>
                  {n > 0 && ", "}
                  <button type="button" className="card-button" onClick={() => onFocusCard("held", offset + n, seat)}>
                    {cardName(id)}
                  </button>
                </span>
              ));
            return (
            <tr key={i.id}>
              <td>
                {i.id === state.leadInvestigator && <span title={t("status.lead")}>★ </span>}
                {printed?.name ?? i.id}
                {i.defeated && ` (${i.defeated === "devoured" ? t("status.devoured") : t("status.defeatedBy", { cause: t(`cause.${i.defeated}`) })}${i.removed ? t("status.removed") : ""}${i.replacedBy ? t("status.replacedBy", { name: set.investigators.find((x) => x.id === i.replacedBy)?.name ?? i.replacedBy }) : ""})`}
                {i.delayed && t("status.delayed")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSheet(sheet === i.id ? undefined : i.id);
                    onFocusCard("sheet", seat);
                  }}
                >
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
              <td>{heldButtons(i.possessions, 0)}</td>
              <td>{heldButtons(i.conditions, i.possessions.length)}</td>
              <td>{printed && SKILLS.map((k) => `${t(`skill.${k}`)} ${printed.skills[k] + (i.improvements[k] ?? 0)}`).join(", ")}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
