import type { ReactNode } from "react";
import { neighbors } from "../content/board";
import type { Board, GameSet, Lang, Space } from "../content/types";
import { OMEN_TRACK } from "../engine/omen";
import type { GameState } from "../engine/types";
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

const SET_NAMES: Record<string, string> = { eh01: "Core", ...Object.fromEntries(BOARD_SETS.map((s) => [s.id, s.name])) };

export function Panel({ board, set, state, lang, onLang, pieces, spaces, enabled, onToggle, selected, onSelect, children }: PanelProps) {
  const pathType = (a: string, b: string) => board.paths.find((p) => (p.from === a && p.to === b) || (p.from === b && p.to === a))?.type;
  return (
    <aside className="panel">
      <h1>Eldritch Horror</h1>
      {children}
      {state && <Status board={board} set={set} state={state} />}
      <fieldset>
        <legend>Board language</legend>
        {(["en", "ru"] as const).map((l) => (
          <label key={l}>
            <input type="radio" name="board-lang" checked={lang === l} onChange={() => onLang(l)} /> {l === "en" ? "English" : "Русский"}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Sets</legend>
        <label>
          <input type="checkbox" checked disabled /> Core
        </label>
        {BOARD_SETS.map((s) => (
          <label key={s.id}>
            <input type="checkbox" checked={enabled.has(s.id)} onChange={(e) => onToggle(s.id, e.target.checked)} /> {s.name}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Paths</legend>
        {Object.entries(PATH_COLORS).map(([type, color]) => (
          <span key={type} className="swatch">
            <i style={{ background: color }} /> {type}
          </span>
        ))}
      </fieldset>
      <section aria-live="polite">
        <h2>Selected space</h2>
        {selected ? (
          <dl>
            <dt>Id</dt>
            <dd>{selected.id}</dd>
            <dt>Name</dt>
            <dd>
              {selected.name.en} / {selected.name.ru}
            </dd>
            <dt>Kind</dt>
            <dd>{selected.kind}</dd>
            <dt>Region</dt>
            <dd>{selected.region ?? "none"}</dd>
            <dt>Set</dt>
            <dd>{SET_NAMES[selected.set]}</dd>
            <dt>Pieces</dt>
            <dd>{pieces.get(selected.id)?.map((p) => p.label).join(", ") ?? "none"}</dd>
            <dt>Neighbours</dt>
            <dd>
              <ul>
                {neighbors(board, selected.id).map((n) => (
                  <li key={n}>
                    <button type="button" onClick={() => onSelect(n)}>
                      {board.spaces.find((s) => s.id === n)?.name.en ?? n}
                    </button>{" "}
                    <small>{pathType(selected.id, n)}</small>
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        ) : (
          <p>Click a marker or pick a space below.</p>
        )}
      </section>
      <section>
        <h2>Spaces</h2>
        <ul className="spaces">
          {spaces.map((s) => (
            <li key={s.id}>
              <button type="button" aria-pressed={s.id === selected?.id} onClick={() => onSelect(s.id)}>
                {s.name.en}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function Status({ board, set, state }: { board: Board; set: GameSet; state: GameState }) {
  const ancientOne = set.ancientOnes.find((a) => a.id === state.ancientOne);
  const mystery = ancientOne?.mysteries.find((m) => m.id === state.currentMystery);
  const cardName = (id: string) => set.cards.find((c) => c.id === id)?.name ?? id;
  const spaceName = (id: string) => board.spaces.find((s) => s.id === id)?.name.en ?? id;
  const { encounters, ...decks } = state.decks;
  const sizes = Object.entries({ ...decks, ...encounters, "monster cup": state.monsterCup, "gate stack": state.gateStack, "clue pool": state.cluePool });
  const ongoing = state.ongoingMythos.map((id) => set.mythos.find((m) => m.id === id)).filter((m) => m !== undefined);
  return (
    <section className="status">
      <h2>
        {ancientOne?.name ?? state.ancientOne}
        {state.awakened && " (awakened)"}
      </h2>
      <dl>
        <dt>Doom</dt>
        <dd>
          {state.doom}
        </dd>
        <dt>Omen</dt>
        <dd>
          {OMEN_TRACK[state.omen]}, {state.eldritchOnOmen[state.omen]} eldritch
        </dd>
        <dt>Reference card</dt>
        <dd>
          gates {state.referenceCard.gates}, clues {state.referenceCard.clues}, surge {state.referenceCard.surge}
        </dd>
        <dt>Mystery</dt>
        <dd className="cards">
          {mystery && <img src={`/${mystery.images.front}`} alt={mystery.name} />}
          {state.awakened && ancientOne?.images.back && <img src={`/${ancientOne.images.back}`} alt={`${ancientOne.name} awakened`} />}
          {state.solvedMysteries.length} solved{state.finalMysterySolved && ", final mystery solved"}
        </dd>
        <dt>Reserve</dt>
        <dd className="cards">
          {state.reserve.map((id) => {
            const card = set.cards.find((c) => c.id === id);
            return (
              card && (
                <figure key={id}>
                  <img src={`/${card.images.front}`} alt={card.name} />
                  <figcaption>value {card.value}</figcaption>
                </figure>
              )
            );
          })}
        </dd>
        <dt>Ongoing mythos</dt>
        <dd className="cards">
          {ongoing.map((m) => (
            <img key={m.id} src={`/${m.images.front}`} alt={m.name} />
          ))}
        </dd>
        <dt>Decks</dt>
        <dd>{sizes.map(([name, cards]) => `${name} ${cards.length}`).join(", ")}</dd>
      </dl>
      <table>
        <thead>
          <tr>
            <th>Investigator</th>
            <th>Space</th>
            <th>H</th>
            <th>S</th>
            <th>Clues</th>
            <th>Tickets</th>
            <th>Possessions</th>
            <th>Conditions</th>
            <th>Improvements</th>
          </tr>
        </thead>
        <tbody>
          {state.investigators.map((i) => (
            <tr key={i.id}>
              <td>
                {i.id === state.leadInvestigator && <span title="Lead investigator">★ </span>}
                {set.investigators.find((x) => x.id === i.id)?.name ?? i.id}
                {i.defeated && ` (${i.defeated === "devoured" ? "devoured" : `defeated by ${i.defeated}`}${i.replacedBy ? `, replaced by ${set.investigators.find((x) => x.id === i.replacedBy)?.name ?? i.replacedBy}` : ""})`}
                {i.delayed && " (delayed)"}
              </td>
              <td>{spaceName(i.space)}</td>
              <td>{i.health}</td>
              <td>{i.sanity}</td>
              <td>{i.clues}</td>
              <td>{i.tickets.join(", ")}</td>
              <td>{i.possessions.map(cardName).join(", ")}</td>
              <td>{i.conditions.map(cardName).join(", ")}</td>
              <td>
                {Object.entries(i.improvements)
                  .map(([k, v]) => `${k[0]!.toUpperCase()}${k.slice(1)} +${v}`)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
