import { useState } from "react";
import type { Board, GameSet } from "../../content/types";
import { ambush, changeEldritchOnOmen, closeGate, discardOngoing, placeToken, removeToken, spawnClueByText, spawnGateByText, spawnMonsterByText, spawnMonsterRandomly, spawnNamed, spawnSetAside } from "../../engine/effects";
import { OMEN_TRACK } from "../../engine/omen";
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


/** The Board group of card-text controls (design D2). */
export function BoardEffects({ board, set, state, me, space, onAct }: Props) {
  const [omenSlot, setOmenSlot] = useState(0);
  const [aside, setAside] = useState("");
  const [kind, setKind] = useState("");
  const [ongoing, setOngoing] = useState("");
  const content = { board, set };
  const t = useT();
  const spaceName = useSpaceName();
  const cupKinds = [...new Set(state.monsterCup.map((m) => m.id))].map((k) => ({ id: k, label: t("effects.kindCount", { name: set.monsters.find((m) => m.id === k)?.name ?? k, count: state.monsterCup.filter((m) => m.id === k).length }) })).sort((a, b) => a.label.localeCompare(b.label));
  const asideKinds = [...new Set(state.setAsideMonsters.map((m) => m.id))].map((k) => ({ id: k, label: t("effects.kindCount", { name: set.monsters.find((m) => m.id === k)?.name ?? k, count: state.setAsideMonsters.filter((m) => m.id === k).length }) }));
  return (
    <>
      <p>
        {state.gates.includes(me.space) && (
          <button type="button" onClick={() => onAct((s) => closeGate(s, content, me.id))}>
            {t("effects.closeGate")}
          </button>
        )}
        <button type="button" onClick={() => onAct((s) => spawnGateByText(s, content, me.id))}>
          {t("effects.spawnGate")}
        </button>
        <button type="button" onClick={() => onAct((s) => spawnClueByText(s, content, me.id))}>
          {t("effects.spawnClue")}
        </button>
        <button type="button" onClick={() => onAct((s) => spawnMonsterByText(s, content, me.id, space))}>
          {t("effects.spawnMonsterOn", { space: spaceName(board, space) })}
        </button>
        <button type="button" onClick={() => onAct((s) => spawnMonsterRandomly(s, content, me.id))}>
          {t("effects.spawnMonsterRandom")}
        </button>
        {" "}
        <label>
          {t("effects.kindInCup")}{" "}
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">{t("effects.choose")}</option>
            {cupKinds.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="button" disabled={!kind} onClick={() => onAct((s) => spawnNamed(s, content, me.id, kind, space))}>
          {t("effects.spawnNamedOn", { space: spaceName(board, space) })}
        </button>
        {state.ongoingMythos.length > 0 && (
          <>
            {" "}
            <label>
              {t("effects.ongoingCard")}{" "}
              <select value={ongoing} onChange={(e) => setOngoing(e.target.value)}>
                <option value="">{t("effects.choose")}</option>
                {state.ongoingMythos.map((c) => (
                  <option key={c} value={c}>
                    {set.mythos.find((m) => m.id === c)?.name ?? c}
                  </option>
                ))}
              </select>
            </label>{" "}
            <button type="button" disabled={!ongoing} onClick={() => onAct((s) => discardOngoing(s, content, ongoing))}>
              {t("effects.discardOngoing")}
            </button>
          </>
        )}
        {asideKinds.length > 0 && (
          <>
            {" "}
            <label>
              {t("effects.setAside")}{" "}
              <select value={aside} onChange={(e) => setAside(e.target.value)}>
                <option value="">{t("effects.choose")}</option>
                {asideKinds.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.label}
                  </option>
                ))}
              </select>
            </label>{" "}
            <button type="button" disabled={!aside} onClick={() => onAct((s) => spawnSetAside(s, content, me.id, aside, space))}>
              {t("effects.spawnSetAsideOn", { space: spaceName(board, space) })}
            </button>
          </>
        )}
        {state.phase.name === "encounter" && (
          <button type="button" onClick={() => onAct((s) => ambush(s, content))}>
            {t("effects.ambush")}
          </button>
        )}
      </p>
      <p>
        <button type="button" onClick={() => onAct((s) => placeToken(s, content, "rumor", space))}>
          {t("effects.placeRumor")}
        </button>
        <button type="button" onClick={() => onAct((s) => removeToken(s, content, "rumor", space))}>
          {t("effects.removeRumor")}
        </button>
        <button type="button" onClick={() => onAct((s) => placeToken(s, content, "eldritch", space))}>
          {t("effects.placeEldritch")}
        </button>
        <button type="button" onClick={() => onAct((s) => removeToken(s, content, "eldritch", space))}>
          {t("effects.removeEldritch")}
        </button>{" "}
        <label>
          {t("effects.omenSpace")}{" "}
          <select value={omenSlot} onChange={(e) => setOmenSlot(Number(e.target.value))}>
            {OMEN_TRACK.map((c, n) => (
              <option key={n} value={n}>
                {t(`omen.${c}`)} {n + 1}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="button" onClick={() => onAct((s) => changeEldritchOnOmen(s, omenSlot, 1))}>
          {t("effects.addEldritch")}
        </button>
        <button type="button" onClick={() => onAct((s) => changeEldritchOnOmen(s, omenSlot, -1))}>
          {t("effects.removeEldritchOmen")}
        </button>
      </p>
    </>
  );
}
