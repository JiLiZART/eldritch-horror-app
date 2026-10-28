import { useState } from "react";
import type { Board, Skill, GameSet } from "../../content/types";
import { changeHealth, changeSanity, delay, devour, discardImprovement, gainClue, improveSkill, moveInvestigator, moveInvestigatorRandomly, moveInvestigatorToNearest, spendClue, spendHealth, spendSanity, standUp } from "../../engine/effects";
import type { NearestTarget } from "../../engine/effects";
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

const SKILLS: Skill[] = ["lore", "influence", "observation", "strength", "will"];
const capital = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** The Investigator group of card-text controls (design D2). */
export function InvestigatorEffects({ board, set, me, space, onAct }: Props) {
  const [skill, setSkill] = useState<Skill>("lore");
  const [target, setTarget] = useState<NearestTarget>("city");
  const content = { board, set };

  return (
    <>
      <p>
        <button type="button" onClick={() => onAct((s) => changeHealth(s, content, me.id, -1))}>
          −1 health
        </button>
        <button type="button" onClick={() => onAct((s) => changeHealth(s, content, me.id, 1))}>
          +1 health
        </button>
        <button type="button" onClick={() => onAct((s) => changeSanity(s, content, me.id, -1))}>
          −1 sanity
        </button>
        <button type="button" onClick={() => onAct((s) => changeSanity(s, content, me.id, 1))}>
          +1 sanity
        </button>
        <button type="button" onClick={() => onAct((s) => spendHealth(s, content, me.id, 1))}>
          Spend 1 health
        </button>
        <button type="button" onClick={() => onAct((s) => spendSanity(s, content, me.id, 1))}>
          Spend 1 sanity
        </button>
        <button type="button" onClick={() => onAct((s) => gainClue(s, content, me.id))}>
          Gain clue
        </button>
        <button type="button" onClick={() => onAct((s) => spendClue(s, content, me.id))}>
          Spend clue
        </button>
        <button type="button" onClick={() => onAct((s) => delay(s, content, me.id))}>
          Delay
        </button>
        <button type="button" onClick={() => onAct((s) => standUp(s, content, me.id))}>
          Stand up
        </button>
        <button type="button" onClick={() => onAct((s) => devour(s, content, me.id))}>
          Devour
        </button>
        <button type="button" onClick={() => onAct((s) => moveInvestigator(s, content, me.id, space))}>
          Move to {spaceName(content, space)}
        </button>
        <button type="button" onClick={() => onAct((s) => moveInvestigatorRandomly(s, content, me.id))}>
          Move to a random space
        </button>{" "}
        <label>
          Nearest{" "}
          <select value={target} onChange={(e) => setTarget(e.target.value as NearestTarget)}>
            {(["city", "wilderness", "sea", "gate", "clue"] as const).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="button" onClick={() => onAct((s) => moveInvestigatorToNearest(s, content, me.id, target))}>
          Move to nearest
        </button>
      </p>
      <p>
        <label>
          Skill{" "}
          <select value={skill} onChange={(e) => setSkill(e.target.value as Skill)}>
            {SKILLS.map((k) => (
              <option key={k} value={k}>
                {capital(k)}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="button" onClick={() => onAct((s) => improveSkill(s, content, me.id, skill))}>
          Improve
        </button>
        <button type="button" onClick={() => onAct((s) => discardImprovement(s, content, me.id, skill))}>
          Discard improvement
        </button>
      </p>
    </>
  );
}
