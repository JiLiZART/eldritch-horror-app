import { useState } from "react";
import type { GameSet } from "../content/types";
import { type Offer, trade } from "../engine/actions";
import type { GameState, InvestigatorState, Ticket } from "../engine/types";
import type { Act } from "./Turn";

interface TradeProps {
  set: GameSet;
  state: GameState;
  /** Investigator id whose turn it is. */
  active: string;
  onAct: Act;
  onClose: () => void;
}

/** Trade form (design D4): one offer per side, confirmed in one action. */
export function Trade({ set, state, active, onAct, onClose }: TradeProps) {
  const me = state.investigators.find((i) => i.id === active)!;
  const partners = state.investigators.filter((i) => i.id !== me.id && i.space === me.space);
  const [partner, setPartner] = useState(partners[0]?.id ?? "");
  const [give, setGive] = useState<Offer>({});
  const [receive, setReceive] = useState<Offer>({});
  const other = partners.find((i) => i.id === partner);
  const name = (id: string) => set.investigators.find((i) => i.id === id)?.name ?? id;
  if (partners.length === 0) return <p>Nobody shares {name(me.id)}'s space to trade with.</p>;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAct((s) => trade(s, { partner, give, receive }));
        onClose();
      }}
    >
      <label>
        Trade with{" "}
        <select value={partner} onChange={(e) => setPartner(e.target.value)}>
          {partners.map((i) => (
            <option key={i.id} value={i.id}>
              {name(i.id)}
            </option>
          ))}
        </select>
      </label>
      <OfferFields legend={`${name(me.id)} gives`} holder={me} set={set} offer={give} onChange={setGive} />
      {other && <OfferFields legend={`${name(other.id)} gives`} holder={other} set={set} offer={receive} onChange={setReceive} />}
      <button type="submit">Confirm trade</button>{" "}
      <button type="button" onClick={onClose}>
        Close
      </button>
    </form>
  );
}

/** Ticket types held with their counts. */
const held = (i: InvestigatorState): [Ticket, number][] => [...new Set(i.tickets)].map((t) => [t, i.tickets.filter((x) => x === t).length]);

function OfferFields({ legend, holder, set, offer, onChange }: { legend: string; holder: InvestigatorState; set: GameSet; offer: Offer; onChange: (o: Offer) => void }) {
  const cardName = (id: string) => set.cards.find((c) => c.id === id)?.name ?? id;
  const toggle = <T,>(list: T[] | undefined, item: T, on: boolean) => (on ? [...(list ?? []), item] : (list ?? []).filter((x) => x !== item));
  return (
    <fieldset>
      <legend>{legend}</legend>
      {holder.possessions.map((id) => (
        <label key={id}>
          <input type="checkbox" checked={offer.possessions?.includes(id) ?? false} onChange={(e) => onChange({ ...offer, possessions: toggle(offer.possessions, id, e.target.checked) })} />{" "}
          {cardName(id)}
        </label>
      ))}
      <label>
        Clues (of {holder.clues}) <input type="number" min={0} max={holder.clues} value={offer.clues ?? 0} onChange={(e) => onChange({ ...offer, clues: Number(e.target.value) })} />
      </label>
      {held(holder).map(([t, count]) => (
        <label key={t}>
          {t} tickets (of {count}){" "}
          <input
            type="number"
            min={0}
            max={count}
            value={offer.tickets?.filter((x) => x === t).length ?? 0}
            onChange={(e) => onChange({ ...offer, tickets: [...(offer.tickets ?? []).filter((x) => x !== t), ...Array<Ticket>(Number(e.target.value)).fill(t)] })}
          />
        </label>
      ))}
    </fieldset>
  );
}
