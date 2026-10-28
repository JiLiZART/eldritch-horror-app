import { useState } from "react";
import type { Board, Skill, GameSet } from "../../content/types";
import { changeHealth, changeSanity, delay, devour, discardImprovement, gainClue, improveSkill, moveInvestigator, moveInvestigatorRandomly, moveInvestigatorToNearest, nearestSpaces, spendClue, spendHealth, spendSanity, standUp } from "../../engine/effects";
import type { NearestTarget } from "../../engine/effects";
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

const SKILLS: Skill[] = ["lore", "influence", "observation", "strength", "will"];

/** The Investigator group of card-text controls (design D2). */
export function InvestigatorEffects({ board, set, state, me, space, onAct }: Props) {
  const [skill, setSkill] = useState<Skill>("lore");
  const [target, setTarget] = useState<NearestTarget>("city");
  /** The players' pick among tied nearest spaces (nearest-choice D3). */
  const [chosen, setChosen] = useState("");
  const content = { board, set };
  const tied = nearestSpaces(state, content, me.id, target);
  const t = useT();
  const spaceName = useSpaceName();

  return (
    <>
      <p>
        <button type="button" onClick={() => onAct((s) => changeHealth(s, content, me.id, -1))}>
          {t("effects.healthMinus")}
        </button>
        <button type="button" onClick={() => onAct((s) => changeHealth(s, content, me.id, 1))}>
          {t("effects.healthPlus")}
        </button>
        <button type="button" onClick={() => onAct((s) => changeSanity(s, content, me.id, -1))}>
          {t("effects.sanityMinus")}
        </button>
        <button type="button" onClick={() => onAct((s) => changeSanity(s, content, me.id, 1))}>
          {t("effects.sanityPlus")}
        </button>
        <button type="button" onClick={() => onAct((s) => spendHealth(s, content, me.id, 1))}>
          {t("effects.spendHealth")}
        </button>
        <button type="button" onClick={() => onAct((s) => spendSanity(s, content, me.id, 1))}>
          {t("effects.spendSanity")}
        </button>
        <button type="button" onClick={() => onAct((s) => gainClue(s, content, me.id))}>
          {t("effects.gainClue")}
        </button>
        <button type="button" onClick={() => onAct((s) => spendClue(s, content, me.id))}>
          {t("effects.spendClue")}
        </button>
        <button type="button" onClick={() => onAct((s) => delay(s, content, me.id))}>
          {t("effects.delay")}
        </button>
        <button type="button" onClick={() => onAct((s) => standUp(s, content, me.id))}>
          {t("effects.standUp")}
        </button>
        <button type="button" onClick={() => onAct((s) => devour(s, content, me.id))}>
          {t("effects.devour")}
        </button>
        <button type="button" onClick={() => onAct((s) => moveInvestigator(s, content, me.id, space))}>
          {t("effects.moveToSpace", { space: spaceName(board, space) })}
        </button>
        <button type="button" onClick={() => onAct((s) => moveInvestigatorRandomly(s, content, me.id))}>
          {t("effects.moveRandom")}
        </button>{" "}
        <label>
          {t("effects.nearest")}{" "}
          <select value={target} onChange={(e) => setTarget(e.target.value as NearestTarget)}>
            {(["city", "wilderness", "sea", "gate", "clue"] as const).map((k) => (
              <option key={k} value={k}>
                {t(`nearest.${k}`)}
              </option>
            ))}
          </select>
        </label>{" "}
        {tied.length > 1 && (
          <select value={chosen} onChange={(e) => setChosen(e.target.value)}>
            <option value="">{t("effects.choose")}</option>
            {tied.map((id) => (
              <option key={id} value={id}>
                {spaceName(board, id)}
              </option>
            ))}
          </select>
        )}{" "}
        <button type="button" onClick={() => onAct((s) => moveInvestigatorToNearest(s, content, me.id, target, chosen || undefined))}>
          {t("effects.moveNearest")}
        </button>
      </p>
      <p>
        <label>
          {t("effects.skill")}{" "}
          <select value={skill} onChange={(e) => setSkill(e.target.value as Skill)}>
            {SKILLS.map((k) => (
              <option key={k} value={k}>
                {t(`skill.${k}`)}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="button" onClick={() => onAct((s) => improveSkill(s, content, me.id, skill))}>
          {t("effects.improve")}
        </button>
        <button type="button" onClick={() => onAct((s) => discardImprovement(s, content, me.id, skill))}>
          {t("effects.discardImprovement")}
        </button>
      </p>
    </>
  );
}
