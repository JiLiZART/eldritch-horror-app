import { useState } from "react";
import type { Board, GameSet } from "../content/types";
import { acquireAssets, componentAction, endTurn, prepareForTravel, rest, travel } from "../engine/actions";
import type { ActionPhase, GameState, Ticket } from "../engine/types";
import { Acquire } from "./Acquire";
import { useSpaceName, useT } from "./lang";
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
  const t = useT();
  const me = state.investigators.find((i) => i.id === phase.active)!;
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  const nameOf = useSpaceName();
  const spaceName = (id: string) => nameOf(board, id);
  const full = me.tickets.length >= 2;
  const cardTitle = (id: string) => set.cards.find((c) => c.id === id)?.name ?? id;
  /** The own sheet and possessions, then same-space investigators' possessions for a local action. */
  const components = state.investigators
    .filter((i) => !i.defeated && i.space === me.space)
    .flatMap((i) => (i.id === me.id ? [{ id: i.id, label: t("turn.sheet", { name: name(i.id) }) }, ...i.possessions.map((c) => ({ id: c, label: cardTitle(c) }))] : i.possessions.map((c) => ({ id: c, label: `${cardTitle(c)} (${name(i.id)})` }))));
  return (
    <section className="turn">
      <h2>{t("turn.heading", { round: state.round })}</h2>
      <p>
        {t("turn.status", { name: name(me.id), left: 2 - phase.taken.length, tickets: me.tickets.map((x) => t(`ticket.${x}`)).join(", ") || t("game.none") })}
      </p>
      {me.delayed ? (
        <div>
          <p>{t("turn.delayed", { name: name(me.id) })}</p>
          <button type="button" onClick={() => onAct(endTurn)}>
            {t("turn.endTurn")}
          </button>
        </div>
      ) : route ? (
        <div>
          <p>{t("turn.route", { route: route.length ? route.map(spaceName).join(" → ") : t("turn.pickSpaces") })}</p>
          <button type="button" disabled={route.length === 0} onClick={() => onAct((s) => travel(s, board, route))}>
            {t("turn.confirmTravel")}
          </button>{" "}
          <button type="button" onClick={() => onRoute(undefined)}>
            {t("turn.cancel")}
          </button>
        </div>
      ) : (
        <div>
          <button type="button" onClick={() => onRoute([])}>
            {t("turn.travel")}
          </button>{" "}
          <button type="button" onClick={() => onAct((s) => rest(s, set))}>
            {t("turn.rest")}
          </button>{" "}
          {TICKETS.map((tk) => (
            <button key={tk} type="button" onClick={() => onAct((s) => prepareForTravel(s, board, tk, full ? discard : undefined))}>
              {t("turn.prepare", { ticket: t(`ticket.${tk}`) })}
            </button>
          ))}{" "}
          {full && (
            <label>
              {t("turn.giveUp")}{" "}
              <select value={discard} onChange={(e) => setDiscard(e.target.value as Ticket)}>
                {TICKETS.map((tk) => (
                  <option key={tk} value={tk}>
                    {t("turn.ticket", { ticket: t(`ticket.${tk}`) })}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="button" onClick={() => onAct((s) => acquireAssets(s, board, set))}>
            {t("turn.acquire")}
          </button>{" "}
          <label>
            {t("turn.component")}{" "}
            <select value={component} onChange={(e) => setComponent(e.target.value)}>
              <option value="">{t("turn.choose")}</option>
              {components.map((c) => (
                <option key={c.id} value={c.id} disabled={state.usedComponents.includes(c.id)}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" disabled={!component} onClick={() => onAct((s) => componentAction(s, set, component))}>
            {t("turn.componentAction")}
          </button>{" "}
          <button type="button" onClick={() => setTrading((on) => !on)}>
            {t("turn.trade")}
          </button>{" "}
          <button type="button" onClick={() => onAct(endTurn)}>
            {t("turn.endTurn")}
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
