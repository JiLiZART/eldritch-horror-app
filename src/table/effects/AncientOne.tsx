import type { Board, GameSet } from "../../content/types";
import { changeDoom, changeMysteryTokens, solveFinalMystery, solveMystery } from "../../engine/ancientOne";
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


/** The AncientOne group of card-text controls (design D2). */
export function AncientOneEffects({ board, set, state, onAct }: Props) {

  const content = { board, set };

  return (
    <>
      <p>
        <button type="button" onClick={() => onAct((s) => changeDoom(s, content, -1))}>
          Advance doom
        </button>
        <button type="button" onClick={() => onAct((s) => changeDoom(s, content, 1))}>
          Retreat doom
        </button>
        <button type="button" onClick={() => onAct((s) => solveMystery(s, content))}>
          Solve mystery
        </button>
        <button type="button" onClick={() => onAct((s) => changeMysteryTokens(s, 1))}>
          Place token on mystery
        </button>
        <button type="button" onClick={() => onAct((s) => changeMysteryTokens(s, -1))}>
          Remove token
        </button>
        {state.awakened && (
          <button type="button" onClick={() => onAct((s) => solveFinalMystery(s, content))}>
            Solve final mystery
          </button>
        )}
      </p>
    </>
  );
}
