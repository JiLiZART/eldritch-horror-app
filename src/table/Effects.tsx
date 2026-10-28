import { useState } from "react";
import type { Board, GameSet } from "../content/types";
import type { GameState } from "../engine/types";
import { AncientOneEffects } from "./effects/AncientOne";
import { BoardEffects } from "./effects/Board";
import { CardsEffects } from "./effects/Cards";
import { InvestigatorEffects } from "./effects/Investigator";
import { MonstersEffects } from "./effects/Monsters";
import type { Act } from "./Turn";

interface EffectsProps {
  board: Board;
  set: GameSet;
  state: GameState;
  /** Investigator chosen at first: the one encountering, or the lead. */
  who: string;
  onAct: Act;
}

/** Card text applied by hand (design D6): the investigator and space selects, then one foldable group per subject (design D2). Rules stay in the engine. */
export function Effects({ board, set, state, who, onAct }: EffectsProps) {
  const [id, setId] = useState(who);
  const [space, setSpace] = useState(board.spaces[0]!.id);
  const me = state.investigators.find((i) => i.id === id) ?? state.investigators[0]!;
  const name = (x: string) => set.investigators.find((i) => i.id === x)?.name ?? x;
  const groups = [
    ["Investigator", true, InvestigatorEffects],
    ["Cards", false, CardsEffects],
    ["Board", false, BoardEffects],
    ["Monsters", false, MonstersEffects],
    ["Ancient One", false, AncientOneEffects],
  ] as const;
  return (
    <fieldset className="effects">
      <legend>Apply card text</legend>
      <label>
        Investigator{" "}
        <select value={me.id} onChange={(e) => setId(e.target.value)}>
          {state.investigators
            .filter((i) => !i.defeated)
            .map((i) => (
              <option key={i.id} value={i.id}>
                {name(i.id)}
              </option>
            ))}
        </select>
      </label>
      <label>
        Move to{" "}
        <select value={space} onChange={(e) => setSpace(e.target.value)}>
          {board.spaces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name.en}
            </option>
          ))}
        </select>
      </label>
      {groups.map(([title, open, Group]) => (
        <details key={title} open={open}>
          <summary>{title}</summary>
          <Group board={board} set={set} state={state} me={me} space={space} onAct={onAct} />
        </details>
      ))}
    </fieldset>
  );
}
