import type { Board, GameSet } from "../content/types";
import { drawMythos } from "./mythos";
import type { ActionName, ActionPhase, GameState, InvestigatorState, Ticket } from "./types";

/** Action phase rules (manual_eng.pdf p.3; EH_reference.pdf p.6–10). Each function returns the next state or throws the rule it breaks. */

/** Actions belong to the Action phase. */
function actionPhase(state: GameState): ActionPhase {
  if (state.phase.name !== "action") throw new Error("actions are performed in the Action phase only");
  return state.phase;
}

function active(state: GameState): InvestigatorState {
  return state.investigators.find((i) => i.id === actionPhase(state).active)!;
}

/** Up to 2 different actions per investigator per phase. */
function mayAct(state: GameState, action: ActionName): void {
  const { taken } = actionPhase(state);
  if (taken.length >= 2) throw new Error("an investigator performs up to 2 actions per phase");
  if (taken.includes(action)) throw new Error("each action may be performed once per phase");
}

/** Records the action and replaces the active investigator's state. */
function perform(state: GameState, action: ActionName, next: InvestigatorState): GameState {
  const phase = actionPhase(state);
  return {
    ...state,
    phase: { ...phase, taken: [...phase.taken, action] },
    investigators: state.investigators.map((i) => (i.id === next.id ? next : i)),
  };
}

/** Passes to the next seat clockwise from the lead; once every seat has acted the Mythos phase draws its card (`drawMythos`). Deviation: the Encounter phase is skipped. */
export function endTurn(state: GameState): GameState {
  const seat = state.investigators.findIndex((i) => i.id === actionPhase(state).active);
  const next = state.investigators[(seat + 1) % state.investigators.length]!;
  return next.id === state.leadInvestigator ? drawMythos(state) : { ...state, phase: { name: "action", active: next.id, taken: [] } };
}

/** Rest: 1 health and 1 sanity up to the sheet maximums; not on a space with a monster. */
export function rest(state: GameState, set: GameSet): GameState {
  mayAct(state, "rest");
  const me = active(state);
  const monster = state.monsters.find((m) => m.space === me.space);
  if (monster) throw new Error(`Rest is not allowed on a space with a monster (${monster.id})`);
  const sheet = set.investigators.find((i) => i.id === me.id)!;
  return perform(state, "rest", { ...me, health: Math.min(sheet.health, me.health + 1), sanity: Math.min(sheet.sanity, me.sanity + 1) });
}

function pathTypes(board: Board, a: string, b: string) {
  return board.paths.filter((p) => (p.from === a && p.to === b) || (p.from === b && p.to === a)).map((p) => p.type);
}

/** Travel: the first step is adjacent by any path, each further step spends one held ticket of the path's type. */
export function travel(state: GameState, board: Board, route: string[]): GameState {
  mayAct(state, "travel");
  const me = active(state);
  if (route.length === 0) throw new Error("travel needs at least one space");
  const tickets = [...me.tickets];
  let at = me.space;
  for (const [n, to] of route.entries()) {
    const types = pathTypes(board, at, to);
    if (types.length === 0) throw new Error(`${to} is not adjacent to ${at}`);
    if (n > 0) {
      const spent = tickets.findIndex((t) => types.includes(t));
      if (spent < 0) {
        const held = tickets[0];
        if (!held) throw new Error(`no ticket to spend on the move from ${at} to ${to}`);
        throw new Error(`a ${held} ticket only pays for a ${held} path; ${at} to ${to} is a ${types.join(" or ")} path`);
      }
      tickets.splice(spent, 1);
    }
    at = to;
  }
  return perform(state, "travel", { ...me, space: at, tickets });
}

/** Prepare for Travel: 1 train or ship ticket on a city with such a path; a third ticket replaces the one named in `discard`. */
export function prepareForTravel(state: GameState, board: Board, ticket: Ticket, discard?: Ticket): GameState {
  mayAct(state, "prepare-for-travel");
  const me = active(state);
  const space = board.spaces.find((s) => s.id === me.space);
  if (space?.kind !== "city") throw new Error(`tickets are gained on city spaces only; ${me.space} is ${space?.kind ?? "unknown"}`);
  const leaves = board.paths.some((p) => p.type === ticket && (p.from === me.space || p.to === me.space));
  if (!leaves) throw new Error(`no ${ticket} path leaves ${me.space}`);
  const tickets = [...me.tickets];
  if (tickets.length >= 2) {
    if (!discard) throw new Error("an investigator holds at most 2 tickets; name the ticket to give up");
    const at = tickets.indexOf(discard);
    if (at < 0) throw new Error(`no ${discard} ticket to give up`);
    tickets.splice(at, 1);
  }
  return perform(state, "prepare-for-travel", { ...me, tickets: [...tickets, ticket] });
}

export interface Offer {
  possessions?: string[];
  clues?: number;
  tickets?: Ticket[];
}

/** Removes an offer from its giver, refusing anything not held. */
function take(giver: InvestigatorState, offer: Offer): InvestigatorState {
  const possessions = [...giver.possessions];
  for (const card of offer.possessions ?? []) {
    const at = possessions.indexOf(card);
    if (at < 0) throw new Error(`${giver.id} does not hold ${card}`);
    possessions.splice(at, 1);
  }
  const clues = offer.clues ?? 0;
  if (clues > giver.clues) throw new Error(`${giver.id} holds ${giver.clues} clues, not ${clues}`);
  const tickets = [...giver.tickets];
  for (const ticket of offer.tickets ?? []) {
    const at = tickets.indexOf(ticket);
    if (at < 0) throw new Error(`${giver.id} does not hold a ${ticket} ticket`);
    tickets.splice(at, 1);
  }
  return { ...giver, possessions, clues: giver.clues - clues, tickets };
}

function add(taker: InvestigatorState, offer: Offer): InvestigatorState {
  const tickets = [...taker.tickets, ...(offer.tickets ?? [])];
  if (tickets.length > 2) throw new Error(`${taker.id} would hold more than 2 tickets`);
  return { ...taker, possessions: [...taker.possessions, ...(offer.possessions ?? [])], clues: taker.clues + (offer.clues ?? 0), tickets };
}

/** Trade: both investigators on one space exchange possessions, clues and tickets in both directions at once. */
export function trade(state: GameState, { partner, give, receive }: { partner: string; give: Offer; receive: Offer }): GameState {
  mayAct(state, "trade");
  const me = active(state);
  const other = state.investigators.find((i) => i.id === partner);
  if (!other || other.id === me.id) throw new Error(`no other investigator ${partner}`);
  if (other.space !== me.space) throw new Error(`${other.id} is not on the same space as ${me.id}`);
  const next = add(take(other, receive), give);
  const done = perform(state, "trade", add(take(me, give), receive));
  return { ...done, investigators: done.investigators.map((i) => (i.id === other.id ? next : i)) };
}
