import { useState } from "react";
import type { Board, Deck, GameSet } from "../../content/types";
import { discardCard, gainCard } from "../../engine/effects";
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

const DECKS: Deck[] = ["asset", "spell", "condition", "artifact"];

/** The Cards group of card-text controls (design D2). */
export function CardsEffects({ board, set, me, onAct }: Props) {
  const [deck, setDeck] = useState<Deck>("asset");
  const [cardName, setCardName] = useState("");
  /** The one held card whose image is open. */
  const [shown, setShown] = useState<{ card: string; side: "front" | "back" }>();
  const content = { board, set };
  const cardTitle = (x: string) => set.cards.find((c) => c.id === x)?.name ?? x;
  const names = [...new Set(set.cards.filter((c) => c.deck === deck).map((c) => c.name))].sort();
  const pickDeck = (next: Deck) => {
    setDeck(next);
    setCardName("");
  };
  return (
    <>
      <p>
        <label>
          Deck{" "}
          <select value={deck} onChange={(e) => pickDeck(e.target.value as Deck)}>
            {DECKS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>{" "}
        <label>
          Card{" "}
          <select value={cardName} onChange={(e) => setCardName(e.target.value)}>
            <option value="">random</option>
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="button" onClick={() => onAct((s) => gainCard(s, content, me.id, deck, cardName || undefined))}>
          Gain card
        </button>
      </p>
      <ul>
        {[...me.possessions, ...me.conditions].map((c, n) => {
          const card = set.cards.find((x) => x.id === c);
          const open = shown?.card === c ? shown.side : undefined;
          return (
            <li key={`${c}#${n}`}>
              {cardTitle(c)}
              {me.conditions.includes(c) && " (condition)"}{" "}
              <button type="button" onClick={() => onAct((s) => discardCard(s, content, me.id, c))}>
                Discard
              </button>{" "}
              <button type="button" onClick={() => setShown(open ? undefined : { card: c, side: "front" })}>
                {open ? "Hide" : "Show"}
              </button>
              {card?.images.back && open !== "back" && (
                <>
                  {" "}
                  <button type="button" onClick={() => setShown({ card: c, side: "back" })}>
                    Back (hidden until flipped)
                  </button>
                </>
              )}
              {open && card && (
                <p className="cards">
                  <img className="held-card" src={`/${open === "back" ? card.images.back : card.images.front}`} alt={`${card.name} ${open}`} />
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
