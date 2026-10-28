import type { GameSet } from "../content/types";
import { rerollDie } from "../engine/test";
import type { GameState, Roll } from "../engine/types";
import { useT } from "./lang";
import type { Act } from "./Turn";

interface DiceProps {
  set: GameSet;
  state: GameState;
  roll: Roll;
  onAct: Act;
}

const FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

/** A waiting roll (design D4): the faces, successes marked, a Reroll per die while the roller holds a clue. */
export function Dice({ set, state, roll, onAct }: DiceProps) {
  const clues = state.investigators.find((i) => i.id === roll.investigator)?.clues ?? 0;
  const t = useT();
  return (
    <span className="dice" aria-label={`rolled ${roll.dice.join(", ")}`}>
      {roll.dice.map((d, i) => (
        <span key={i}>
          <b className={d >= 5 ? "success" : undefined}>{FACES[d - 1]}</b>
          <button type="button" disabled={clues === 0} title={t("dice.rerollTitle")} onClick={() => onAct((s) => rerollDie(s, set, i))}>
            {t("dice.reroll")}
          </button>
        </span>
      ))}
    </span>
  );
}
