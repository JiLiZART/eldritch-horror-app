import { useState } from "react";
import type { Board, Deck, GameSet } from "../content/types";
import { changeHealth, changeSanity, closeGate, delay, discardCard, gainCard, gainClue, moveInvestigator, spendClue } from "../engine/effects";
import type { GameState } from "../engine/types";
import type { Act } from "./Turn";

interface EffectsProps {
  board: Board;
  set: GameSet;
  state: GameState;
  /** Investigator chosen at first: the one encountering, or the lead. */
  who: string;
  onAct: Act;
}

const DECKS: Deck[] = ["asset", "spell", "condition", "artifact"];

/** Card text applied by hand (design D6): one button per effect for a chosen investigator. Rules stay in the engine. */
export function Effects({ board, set, state, who, onAct }: EffectsProps) {
  const [id, setId] = useState(who);
  const [deck, setDeck] = useState<Deck>("asset");
  const [cardName, setCardName] = useState("");
  const [space, setSpace] = useState(board.spaces[0]!.id);
  const content = { board, set };
  const me = state.investigators.find((i) => i.id === id) ?? state.investigators[0]!;
  const name = (x: string) => set.investigators.find((i) => i.id === x)?.name ?? x;
  const cardTitle = (x: string) => set.cards.find((c) => c.id === x)?.name ?? x;
  const names = [...new Set(set.cards.filter((c) => c.deck === deck).map((c) => c.name))].sort();
  const pickDeck = (next: Deck) => {
    setDeck(next);
    setCardName("");
  };
  return (
    <fieldset className="effects">
      <legend>Apply card text</legend>
      <label>
        Investigator{" "}
        <select value={me.id} onChange={(e) => setId(e.target.value)}>
          {state.investigators
            .filter((i) => !i.defeated)
            .map((i) => (
              <option key={i.id} value={i.id}>
                {name(i.id)}
              </option>
            ))}
        </select>
      </label>
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
        <button type="button" onClick={() => onAct((s) => gainClue(s, content, me.id))}>
          Gain clue
        </button>
        <button type="button" onClick={() => onAct((s) => spendClue(s, content, me.id))}>
          Spend clue
        </button>
        <button type="button" onClick={() => onAct((s) => delay(s, content, me.id))}>
          Delay
        </button>
        {state.gates.includes(me.space) && (
          <button type="button" onClick={() => onAct((s) => closeGate(s, content, me.id))}>
            Close gate
          </button>
        )}
      </p>
      <p>
        <label>
          Move to{" "}
          <select value={space} onChange={(e) => setSpace(e.target.value)}>
            {board.spaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name.en}
              </option>
            ))}
          </select>
        </label>{" "}
        <button type="button" onClick={() => onAct((s) => moveInvestigator(s, content, me.id, space))}>
          Move
        </button>
      </p>
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
        {[...me.possessions, ...me.conditions].map((c, n) => (
          <li key={`${c}#${n}`}>
            {cardTitle(c)}
            {me.conditions.includes(c) && " (condition)"}{" "}
            <button type="button" onClick={() => onAct((s) => discardCard(s, content, me.id, c))}>
              Discard
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
