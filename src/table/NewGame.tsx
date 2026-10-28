import { useState } from "react";
import type { GameSet } from "../content/types";
import type { Difficulty, SetupOptions } from "../engine/types";

interface NewGameProps {
  set: GameSet;
  running: boolean;
  error: string | undefined;
  onStart: (options: SetupOptions) => void;
  onAbandon: () => void;
  canUndo: boolean;
  onUndo: () => void;
  /** Downloads the game in progress as a file (design D2). */
  onSave: () => void;
  /** Loads a saved game's text, replacing the game in progress (design D3). */
  onLoad: (text: string) => void;
}

const DIFFICULTIES: Difficulty[] = ["normal", "easy", "hard"];

/** Setup choices; checkbox check order is seat order. Inputs outlive a running game so abandoning offers them again. */
export function NewGame({ set, running, error, onStart, onAbandon, canUndo, onUndo, onSave, onLoad }: NewGameProps) {
  const [ancientOne, setAncientOne] = useState(set.ancientOnes[0]?.id ?? "");
  const [seats, setSeats] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const toggleSeat = (id: string, on: boolean) => setSeats((prev) => (on ? [...prev, id] : prev.filter((s) => s !== id)));
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  return (
    <section>
      <h2>Game</h2>
      {running ? (
        <p>
          <button type="button" onClick={onAbandon}>
            Abandon game
          </button>{" "}
          <button type="button" disabled={!canUndo} onClick={onUndo}>
            Undo
          </button>{" "}
          <button type="button" onClick={onSave}>
            Save to file
          </button>{" "}
          <label>
            Load from file <input type="file" accept=".json,application/json" onChange={(e) => void e.target.files?.[0]?.text().then(onLoad)} />
          </label>
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onStart({ ancientOne, investigators: seats, difficulty, seed });
          }}
        >
          <label>
            Ancient One{" "}
            <select value={ancientOne} onChange={(e) => setAncientOne(e.target.value)}>
              {set.ancientOnes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend>Investigators (check in seat order)</legend>
            {set.investigators.map((i) => (
              <label key={i.id}>
                <input type="checkbox" checked={seats.includes(i.id)} onChange={(e) => toggleSeat(i.id, e.target.checked)} /> {i.name}
              </label>
            ))}
            <p>Seats: {seats.length ? seats.map(name).join(", ") : "none"}</p>
          </fieldset>
          <fieldset>
            <legend>Difficulty</legend>
            {DIFFICULTIES.map((d) => (
              <label key={d}>
                <input type="radio" name="difficulty" checked={difficulty === d} onChange={() => setDifficulty(d)} /> {d}
              </label>
            ))}
          </fieldset>
          <label>
            Seed <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
          </label>
          <p>
            <label>
              Load from file <input type="file" accept=".json,application/json" onChange={(e) => void e.target.files?.[0]?.text().then(onLoad)} />
            </label>
            <button type="submit">Start</button>
          </p>
          <p aria-live="assertive" className="error">
            {error}
          </p>
        </form>
      )}
    </section>
  );
}
