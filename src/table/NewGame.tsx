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
}

const DIFFICULTIES: Difficulty[] = ["normal", "easy", "hard"];

/** Setup choices; checkbox check order is seat order. Inputs outlive a running game so abandoning offers them again. */
export function NewGame({ set, running, error, onStart, onAbandon, canUndo, onUndo }: NewGameProps) {
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
