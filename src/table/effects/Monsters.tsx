import { useState } from "react";
import type { Board, GameSet } from "../../content/types";
import { discardMonster, moveMonster, moveMonsterToward } from "../../engine/effects";
import { monsterKey } from "../../engine/encounter";
import type { GameState, InvestigatorState } from "../../engine/types";
import { useSpaceName, useT } from "../lang";
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
  const t = useT();
  const spaceName = useSpaceName();
  const chosen = state.monsters.find((m) => monsterKey(m) === monster) ?? state.monsters[0];
  return (
    <>
      {!chosen && <p>{t("effects.noMonster")}</p>}
      {chosen && (
        <p>
          <label>
            {t("effects.monster")}{" "}
            <select value={monsterKey(chosen)} onChange={(e) => setMonster(e.target.value)}>
              {state.monsters.map((m) => (
                <option key={monsterKey(m)} value={monsterKey(m)}>
                  {t("effects.monsterOn", { name: set.monsters.find((x) => x.id === m.id)?.name ?? m.id, space: spaceName(board, m.space) })}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" onClick={() => onAct((s) => moveMonster(s, content, chosen, space))}>
            {t("effects.moveToSpace", { space: spaceName(board, space) })}
          </button>
          <button type="button" onClick={() => onAct((s) => moveMonsterToward(s, content, chosen))}>
            {t("effects.towardNearest")}
          </button>
          <button type="button" onClick={() => onAct((s) => discardMonster(s, content, chosen))}>
            {t("effects.discard")}
          </button>
        </p>
      )}
    </>
  );
}
