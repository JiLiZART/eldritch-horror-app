import { useState } from "react";
import type { Board, GameSet } from "../content/types";
import { nextRound, replaceInvestigator, resolveMythos } from "../engine/mythos";
import type { GameState, MythosPhase } from "../engine/types";
import { Effects } from "./Effects";
import { useT } from "./lang";
import type { FocusCard } from "./Panel";
import type { Act } from "./Turn";

interface MythosProps {
  board: Board;
  set: GameSet;
  state: GameState;
  phase: MythosPhase;
  error: string | undefined;
  onAct: Act;
  /** Brings the drawn card up in the tableau (mythos-card-focus D1). */
  onFocusCard: FocusCard;
}

/** The Mythos phase beside the board (design D6): the drawn card, its resolution log, the lead choice. Rules stay in the engine. */
export function Mythos({ board, set, state, phase, error, onAct, onFocusCard }: MythosProps) {
  const [lead, setLead] = useState(state.leadInvestigator);
  const [newcomer, setNewcomer] = useState("");
  const t = useT();
  const unused = set.investigators.filter((i) => !state.investigators.some((x) => x.id === i.id));
  const fallen = state.awakened ? [] : state.investigators.filter((i) => i.defeated && !i.replacedBy);
  const card = set.mythos.find((m) => m.id === phase.card);
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  return (
    <section className="turn">
      <h2>{t("mythos.heading", { round: state.round })}</h2>
      <p className="cards">
        {card && (
          <button type="button" className="card-button" onClick={() => onFocusCard("mythos", 0)}>
            <img className="mythos-card" src={`/${card.images.front}`} alt={card.name} />
          </button>
        )}
      </p>
      {phase.log ? (
        <>
          <ol>
            {phase.log.map((line, n) => (
              <li key={n}>{line}</li>
            ))}
          </ol>
          {fallen.map((f) => (
            <p key={f.id}>
              <label>
                {t(f.defeated === "devoured" ? "mythos.devoured" : "mythos.defeated", { name: name(f.id) })}{" "}
                <select value={newcomer} onChange={(e) => setNewcomer(e.target.value)}>
                  <option value="">{t("mythos.chooseInvestigator")}</option>
                  {unused.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </label>{" "}
              <button type="button" disabled={!newcomer} onClick={() => onAct((s) => replaceInvestigator(s, { board, set }, f.id, newcomer))}>
                {t("mythos.replace")}
              </button>
            </p>
          ))}
          <label>
            {t("mythos.lead")}{" "}
            <select value={lead} onChange={(e) => setLead(e.target.value)}>
              {state.investigators.filter((i) => !i.defeated).map((i) => (
                <option key={i.id} value={i.id}>
                  {name(i.id)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => onAct((s) => nextRound(s, set, lead))}>
            {t("mythos.nextRound")}
          </button>
          <Effects board={board} set={set} state={state} who={state.leadInvestigator} onAct={onAct} />
        </>
      ) : (
        <button type="button" onClick={() => onAct((s) => resolveMythos(s, { board, set }))}>
          {t("mythos.resolve")}
        </button>
      )}
      <p aria-live="assertive" className="error">
        {error}
      </p>
    </section>
  );
}
