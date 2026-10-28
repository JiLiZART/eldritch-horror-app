import type { Board, GameSet } from "../../content/types";
import { changeDoom, changeMysteryTokens, solveFinalMystery, solveMystery } from "../../engine/ancientOne";
import type { GameState, InvestigatorState } from "../../engine/types";
import { useT } from "../lang";
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
  const t = useT();

  return (
    <>
      <p>
        <button type="button" onClick={() => onAct((s) => changeDoom(s, content, -1))}>
          {t("effects.advanceDoom")}
        </button>
        <button type="button" onClick={() => onAct((s) => changeDoom(s, content, 1))}>
          {t("effects.retreatDoom")}
        </button>
        <button type="button" onClick={() => onAct((s) => solveMystery(s, content))}>
          {t("effects.solveMystery")}
        </button>
        <button type="button" onClick={() => onAct((s) => changeMysteryTokens(s, 1))}>
          {t("effects.placeMysteryToken")}
        </button>
        <button type="button" onClick={() => onAct((s) => changeMysteryTokens(s, -1))}>
          {t("effects.removeMysteryToken")}
        </button>
        {state.awakened && (
          <button type="button" onClick={() => onAct((s) => solveFinalMystery(s, content))}>
            {t("effects.solveFinal")}
          </button>
        )}
      </p>
    </>
  );
}
