import { useState } from "react";
import type { GameSet } from "../content/types";
import { takeAssets } from "../engine/actions";
import type { GameState } from "../engine/types";
import type { Act } from "./Turn";

interface AcquireProps {
  set: GameSet;
  state: GameState;
  /** The Influence roll waiting for its choice. */
  roll: { dice: number[]; successes: number };
  onAct: Act;
}

const FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

/** Acquire Assets choice (design D5): the roll, reserve cards to gain within it, or one card to discard instead. */
export function Acquire({ set, state, roll, onAct }: AcquireProps) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [discard, setDiscard] = useState("");
  const card = (id: string) => set.cards.find((c) => c.id === id);
  const total = chosen.reduce((sum, id) => sum + (card(id)?.value ?? 0), 0);
  const toggle = (id: string, on: boolean) => setChosen((prev) => (on ? [...prev, id] : prev.filter((c) => c !== id)));
  return (
    <form
      className="acquire"
      onSubmit={(e) => {
        e.preventDefault();
        onAct((s) => takeAssets(s, set, chosen, chosen.length === 0 && discard ? discard : undefined));
      }}
    >
      <p>
        Influence roll{" "}
        <span className="dice" aria-label={`rolled ${roll.dice.join(", ")}`}>
          {roll.dice.map((d, i) => (
            <b key={i} className={d >= 5 ? "success" : undefined}>
              {FACES[d - 1]}
            </b>
          ))}
        </span>{" "}
        result {roll.successes}, chosen value {total}
      </p>
      {state.reserve.map((id) => (
        <label key={id}>
          <input type="checkbox" checked={chosen.includes(id)} onChange={(e) => toggle(id, e.target.checked)} /> {card(id)?.name ?? id} ({card(id)?.value})
        </label>
      ))}
      {chosen.length === 0 && (
        <label>
          Discard instead{" "}
          <select value={discard} onChange={(e) => setDiscard(e.target.value)}>
            <option value="">nothing</option>
            {state.reserve.map((id) => (
              <option key={id} value={id}>
                {card(id)?.name ?? id}
              </option>
            ))}
          </select>
        </label>
      )}
      <button type="submit">Take</button>
    </form>
  );
}
