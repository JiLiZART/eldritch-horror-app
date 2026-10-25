import { neighbors } from "../content/board";
import type { Board, Space } from "../content/types";
import { BOARD_SETS, PATH_COLORS } from "./sets";

interface PanelProps {
  board: Board;
  spaces: Space[];
  enabled: Set<string>;
  onToggle: (id: string, on: boolean) => void;
  selected: Space | undefined;
  onSelect: (id: string) => void;
}

const SET_NAMES: Record<string, string> = { eh01: "Core", ...Object.fromEntries(BOARD_SETS.map((s) => [s.id, s.name])) };

export function Panel({ board, spaces, enabled, onToggle, selected, onSelect }: PanelProps) {
  const pathType = (a: string, b: string) => board.paths.find((p) => (p.from === a && p.to === b) || (p.from === b && p.to === a))?.type;
  return (
    <aside className="panel">
      <h1>Eldritch Horror</h1>
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
