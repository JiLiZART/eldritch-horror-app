import { useState } from "react";
import type { Board, GameSet } from "../content/types";
import { nextRound, resolveMythos } from "../engine/mythos";
import type { GameState, MythosPhase } from "../engine/types";
import type { Act } from "./Turn";

interface MythosProps {
  board: Board;
  set: GameSet;
  state: GameState;
  phase: MythosPhase;
  error: string | undefined;
  onAct: Act;
}

/** The Mythos phase beside the board (design D6): the drawn card, its resolution log, the lead choice. Rules stay in the engine. */
export function Mythos({ board, set, state, phase, error, onAct }: MythosProps) {
  const [lead, setLead] = useState(state.leadInvestigator);
  const card = set.mythos.find((m) => m.id === phase.card);
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  return (
    <section className="turn">
      <h2>Round {state.round}, Mythos phase</h2>
      <p className="cards">{card && <img className="mythos-card" src={`/${card.images.front}`} alt={card.name} />}</p>
      {phase.log ? (
        <>
          <ol>
            {phase.log.map((line, n) => (
              <li key={n}>{line}</li>
            ))}
          </ol>
          <label>
            Lead investigator for the next round{" "}
            <select value={lead} onChange={(e) => setLead(e.target.value)}>
              {state.investigators.map((i) => (
                <option key={i.id} value={i.id}>
                  {name(i.id)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => onAct((s) => nextRound(s, lead))}>
            Next round
          </button>
        </>
      ) : (
        <button type="button" onClick={() => onAct((s) => resolveMythos(s, { board, set }))}>
          Resolve
        </button>
      )}
      <p aria-live="assertive" className="error">
        {error}
      </p>
      <p>
        <small>The Encounter phase is skipped; the Mythos phase follows the last Action turn.</small>
      </p>
    </section>
  );
}
