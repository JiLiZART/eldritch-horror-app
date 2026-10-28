import { useState } from "react";
import type { Board, GameSet } from "../../content/types";
import { discardMonster, moveMonster, moveMonsterToward } from "../../engine/effects";
import { monsterKey } from "../../engine/encounter";
import { spaceName } from "../../engine/spawn";
import type { GameState, InvestigatorState } from "../../engine/types";
import type { Act } from "../Turn";

interface Props {
  board: Board;
  set: GameSet;
  state: GameState;
  /** The investigator the effects apply to. */
  me: InvestigatorState;
  /** The space chosen in the shell. */
  space: string;
  onAct: Act;
}


/** The Monsters group of card-text controls (design D2). */
export function MonstersEffects({ board, set, state, space, onAct }: Props) {
  const [monster, setMonster] = useState("");
  const content = { board, set };
  const chosen = state.monsters.find((m) => monsterKey(m) === monster) ?? state.monsters[0];
  return (
    <>
      {!chosen && <p>no monster on the board</p>}
      {chosen && (
        <p>
          <label>
            Monster{" "}
            <select value={monsterKey(chosen)} onChange={(e) => setMonster(e.target.value)}>
              {state.monsters.map((m) => (
                <option key={monsterKey(m)} value={monsterKey(m)}>
                  {set.monsters.find((x) => x.id === m.id)?.name ?? m.id} on {spaceName(content, m.space)}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" onClick={() => onAct((s) => moveMonster(s, content, chosen, space))}>
            Move to {spaceName(content, space)}
          </button>
          <button type="button" onClick={() => onAct((s) => moveMonsterToward(s, content, chosen))}>
            Toward nearest investigator
          </button>
          <button type="button" onClick={() => onAct((s) => discardMonster(s, content, chosen))}>
            Discard
          </button>
        </p>
      )}
    </>
  );
}
