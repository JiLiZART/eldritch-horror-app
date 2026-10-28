import { useState } from "react";
import type { GameSet } from "../content/types";
import type { Difficulty, SetupOptions } from "../engine/types";
import { useT } from "./lang";
import type { SlotInfo } from "./saved";

interface NewGameProps {
  set: GameSet;
  running: boolean;
  error: string | undefined;
  onStart: (options: SetupOptions) => void;
  onAbandon: () => void;
  canUndo: boolean;
  onUndo: () => void;
  /** Glides the view back to the whole table (fit-view D2). */
  onFit: () => void;
  /** Downloads the game in progress as a file (design D2). */
  onSave: () => void;
  /** Loads a saved game's text into a new slot (design D3). */
  onLoad: (text: string) => void;
  /** Puts the game in progress aside, its slot kept, and offers the form. */
  onNew: () => void;
  /** Every saved slot and the one in play (save-slots D3). */
  slots: SlotInfo[];
  current: string | undefined;
  onSwitch: (id: string) => void;
  onRemove: (id: string) => void;
}

const DIFFICULTIES: Difficulty[] = ["normal", "easy", "hard"];

/** Setup choices; checkbox check order is seat order. Inputs outlive a running game so abandoning offers them again. */
export function NewGame({ set, running, error, onStart, onAbandon, canUndo, onUndo, onFit, onSave, onLoad, onNew, slots, current, onSwitch, onRemove }: NewGameProps) {
  const [ancientOne, setAncientOne] = useState(set.ancientOnes[0]?.id ?? "");
  const [seats, setSeats] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const t = useT();
  const toggleSeat = (id: string, on: boolean) => setSeats((prev) => (on ? [...prev, id] : prev.filter((s) => s !== id)));
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  return (
    <section>
      <h2>{t("game.title")}</h2>
      {running ? (
        <p>
          <button type="button" onClick={onAbandon}>
            {t("game.abandon")}
          </button>{" "}
          <button type="button" disabled={!canUndo} onClick={onUndo}>
            {t("game.undo")}
          </button>{" "}
          <button type="button" onClick={onFit}>
            {t("game.fitTable")}
          </button>{" "}
          <button type="button" onClick={onSave}>
            {t("game.save")}
          </button>{" "}
          <label>
            {t("game.load")} <input type="file" accept=".json,application/json" onChange={(e) => void e.target.files?.[0]?.text().then(onLoad)} />
          </label>{" "}
          <button type="button" onClick={onNew}>
            {t("game.new")}
          </button>
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onStart({ ancientOne, investigators: seats, difficulty, seed });
          }}
        >
          <label>
            {t("game.ancientOne")}{" "}
            <select value={ancientOne} onChange={(e) => setAncientOne(e.target.value)}>
              {set.ancientOnes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend>{t("game.investigators")}</legend>
            {set.investigators.map((i) => (
              <label key={i.id}>
                <input type="checkbox" checked={seats.includes(i.id)} onChange={(e) => toggleSeat(i.id, e.target.checked)} /> {i.name}
              </label>
            ))}
            <p>{t("game.seats", { seats: seats.length ? seats.map(name).join(", ") : t("game.none") })}</p>
          </fieldset>
          <fieldset>
            <legend>{t("game.difficulty")}</legend>
            {DIFFICULTIES.map((d) => (
              <label key={d}>
                <input type="radio" name="difficulty" checked={difficulty === d} onChange={() => setDifficulty(d)} /> {t(`difficulty.${d}`)}
              </label>
            ))}
          </fieldset>
          <label>
            {t("game.seed")} <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
          </label>
          <p>
            <label>
              {t("game.load")} <input type="file" accept=".json,application/json" onChange={(e) => void e.target.files?.[0]?.text().then(onLoad)} />
            </label>
            <button type="submit">{t("game.start")}</button>
          </p>
          <p aria-live="assertive" className="error">
            {error}
          </p>
        </form>
      )}
      {slots.length > 0 && (
        <section>
          <h3>{t("game.games")}</h3>
          <ul>
            {slots.map((s) => (
              <li key={s.id}>
                {s.name} {s.id === current && t("game.current")}{" "}
                <button type="button" disabled={s.id === current} onClick={() => onSwitch(s.id)}>
                  {t("game.switch")}
                </button>{" "}
                <button type="button" onClick={() => onRemove(s.id)}>
                  {t("game.remove")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
