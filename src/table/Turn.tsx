import { useState } from "react";
import type { Board, GameSet } from "../content/types";
import { acquireAssets, componentAction, endTurn, prepareForTravel, rest, travel } from "../engine/actions";
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
  const [component, setComponent] = useState("");
  const me = state.investigators.find((i) => i.id === phase.active)!;
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  const spaceName = (id: string) => board.spaces.find((s) => s.id === id)?.name.en ?? id;
  const full = me.tickets.length >= 2;
  const cardTitle = (id: string) => set.cards.find((c) => c.id === id)?.name ?? id;
  /** The own sheet and possessions, then same-space investigators' possessions for a local action. */
  const components = state.investigators
    .filter((i) => !i.defeated && i.space === me.space)
    .flatMap((i) => (i.id === me.id ? [{ id: i.id, label: `${name(i.id)}'s sheet` }, ...i.possessions.map((c) => ({ id: c, label: cardTitle(c) }))] : i.possessions.map((c) => ({ id: c, label: `${cardTitle(c)} (${name(i.id)})` }))));
  return (
    <section className="turn">
      <h2>Round {state.round}, Action phase</h2>
      <p>
        {name(me.id)} is active, {2 - phase.taken.length} actions left, tickets: {me.tickets.join(", ") || "none"}
      </p>
      {me.delayed ? (
        <div>
          <p>{name(me.id)} is delayed: ending the turn stands the token up.</p>
          <button type="button" onClick={() => onAct(endTurn)}>
            End turn
          </button>
        </div>
      ) : route ? (
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
          <label>
            Component{" "}
            <select value={component} onChange={(e) => setComponent(e.target.value)}>
              <option value="">choose</option>
              {components.map((c) => (
                <option key={c.id} value={c.id} disabled={state.usedComponents.includes(c.id)}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" disabled={!component} onClick={() => onAct((s) => componentAction(s, set, component))}>
            Component action
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
    </section>
  );
}
