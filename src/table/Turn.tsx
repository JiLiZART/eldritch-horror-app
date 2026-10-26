import { useState } from "react";
import type { Board, GameSet } from "../content/types";
import { acquireAssets, endTurn, prepareForTravel, rest, travel } from "../engine/actions";
import type { ActionPhase, GameState, Ticket } from "../engine/types";
import { Acquire } from "./Acquire";
import { Trade } from "./Trade";

export type Act = (fn: (state: GameState) => GameState) => void;

interface TurnProps {
  board: Board;
  set: GameSet;
  state: GameState;
  phase: ActionPhase;
  /** Why the last action was refused, in the rule's words. */
  error: string | undefined;
  /** Travel route being picked; undefined outside route mode. */
  route: string[] | undefined;
  onAct: Act;
  onRoute: (route: string[] | undefined) => void;
}

const TICKETS: Ticket[] = ["train", "ship"];

/** The turn in progress and its action controls (design D6). Rules stay in the engine; this only drafts and dispatches. */
export function Turn({ board, set, state, phase, error, route, onAct, onRoute }: TurnProps) {
  const [discard, setDiscard] = useState<Ticket>("train");
  const [trading, setTrading] = useState(false);
  const me = state.investigators.find((i) => i.id === phase.active)!;
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  const spaceName = (id: string) => board.spaces.find((s) => s.id === id)?.name.en ?? id;
  const full = me.tickets.length >= 2;
  return (
    <section className="turn">
      <h2>Round {state.round}, Action phase</h2>
      <p>
        {name(me.id)} is active, {2 - phase.taken.length} actions left, tickets: {me.tickets.join(", ") || "none"}
      </p>
      {route ? (
        <div>
          <p>Route: {route.length ? route.map(spaceName).join(" → ") : "pick spaces on the table"}</p>
          <button type="button" disabled={route.length === 0} onClick={() => onAct((s) => travel(s, board, route))}>
            Confirm travel
          </button>{" "}
          <button type="button" onClick={() => onRoute(undefined)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <button type="button" onClick={() => onRoute([])}>
            Travel
          </button>{" "}
          <button type="button" onClick={() => onAct((s) => rest(s, set))}>
            Rest
          </button>{" "}
          {TICKETS.map((t) => (
            <button key={t} type="button" onClick={() => onAct((s) => prepareForTravel(s, board, t, full ? discard : undefined))}>
              Prepare for travel: {t}
            </button>
          ))}{" "}
          {full && (
            <label>
              give up{" "}
              <select value={discard} onChange={(e) => setDiscard(e.target.value as Ticket)}>
                {TICKETS.map((t) => (
                  <option key={t} value={t}>
                    {t} ticket
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="button" onClick={() => onAct((s) => acquireAssets(s, board, set))}>
            Acquire Assets
          </button>{" "}
          <button type="button" onClick={() => setTrading((on) => !on)}>
            Trade
          </button>{" "}
          <button type="button" onClick={() => onAct(endTurn)}>
            End turn
          </button>
        </div>
      )}
      {/* Keyed on the roll so a new roll starts with nothing chosen. */}
      {phase.acquiring && <Acquire key={state.rolls} set={set} state={state} roll={phase.acquiring} onAct={onAct} />}
      {trading && !route && <Trade set={set} state={state} active={me.id} onAct={onAct} onClose={() => setTrading(false)} />}
      <p aria-live="assertive" className="error">
        {error}
      </p>
      <p>
        <small>The Encounter phase is skipped; ending the last turn opens the Mythos phase.</small>
      </p>
    </section>
  );
}
