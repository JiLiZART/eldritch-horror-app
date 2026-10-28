import { useState } from "react";
import type { Board, Deck, GameSet, Skill } from "../content/types";
import { changeDoom, changeMysteryTokens, solveFinalMystery, solveMystery } from "../engine/ancientOne";
import { ambush, changeEldritchOnOmen, changeHealth, changeSanity, closeGate, delay, devour, discardCard, discardImprovement, discardMonster, discardOngoing, gainCard, gainClue, improveSkill, moveInvestigator, moveMonster, moveInvestigatorRandomly, moveInvestigatorToNearest, moveMonsterToward, placeToken, removeToken, spawnClueByText, spawnGateByText, spawnMonsterByText, spawnMonsterRandomly, spawnNamed, spawnSetAside, spendClue, spendHealth, spendSanity, standUp } from "../engine/effects";
import { OMEN_TRACK } from "../engine/omen";
import { monsterKey } from "../engine/encounter";
import { spaceName } from "../engine/spawn";
import type { GameState } from "../engine/types";
import type { NearestTarget } from "../engine/effects";
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
const SKILLS: Skill[] = ["lore", "influence", "observation", "strength", "will"];
const capital = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/** Card text applied by hand (design D6): one button per effect for a chosen investigator. Rules stay in the engine. */
export function Effects({ board, set, state, who, onAct }: EffectsProps) {
  const [id, setId] = useState(who);
  const [deck, setDeck] = useState<Deck>("asset");
  const [cardName, setCardName] = useState("");
  const [space, setSpace] = useState(board.spaces[0]!.id);
  const [monster, setMonster] = useState("");
  const [skill, setSkill] = useState<Skill>("lore");
  const [omenSlot, setOmenSlot] = useState(0);
  const [target, setTarget] = useState<NearestTarget>("city");
  const [aside, setAside] = useState("");
  const [kind, setKind] = useState("");
  const [ongoing, setOngoing] = useState("");
  /** The one held card whose image is open (design D1). */
  const [shown, setShown] = useState<{ card: string; side: "front" | "back" }>();
  const cupKinds = [...new Set(state.monsterCup.map((m) => m.id))].map((k) => ({ id: k, label: `${set.monsters.find((m) => m.id === k)?.name ?? k} (${state.monsterCup.filter((m) => m.id === k).length})` })).sort((a, b) => a.label.localeCompare(b.label));
  const asideKinds = [...new Set(state.setAsideMonsters.map((m) => m.id))].map((k) => ({ id: k, label: `${set.monsters.find((m) => m.id === k)?.name ?? k} (${state.setAsideMonsters.filter((m) => m.id === k).length})` }));
  const content = { board, set };
  const me = state.investigators.find((i) => i.id === id) ?? state.investigators[0]!;
  const name = (x: string) => set.investigators.find((i) => i.id === x)?.name ?? x;
  const cardTitle = (x: string) => set.cards.find((c) => c.id === x)?.name ?? x;
  const chosen = state.monsters.find((m) => monsterKey(m) === monster) ?? state.monsters[0];
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
      <label>
          Move to{" "}
          <select value={space} onChange={(e) => setSpace(e.target.value)}>
            {board.spaces.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name.en}
              </option>
            ))}
          </select>
        </label>
      <details open>
        <summary>Investigator</summary>
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
          <button type="button" onClick={() => onAct((s) => spendHealth(s, content, me.id, 1))}>
            Spend 1 health
          </button>
          <button type="button" onClick={() => onAct((s) => spendSanity(s, content, me.id, 1))}>
            Spend 1 sanity
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
          <button type="button" onClick={() => onAct((s) => standUp(s, content, me.id))}>
            Stand up
          </button>
          <button type="button" onClick={() => onAct((s) => devour(s, content, me.id))}>
            Devour
          </button>
          <button type="button" onClick={() => onAct((s) => moveInvestigator(s, content, me.id, space))}>
            Move to {spaceName(content, space)}
          </button>
          <button type="button" onClick={() => onAct((s) => moveInvestigatorRandomly(s, content, me.id))}>
            Move to a random space
          </button>{" "}
          <label>
            Nearest{" "}
            <select value={target} onChange={(e) => setTarget(e.target.value as NearestTarget)}>
              {(["city", "wilderness", "sea", "gate", "clue"] as const).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" onClick={() => onAct((s) => moveInvestigatorToNearest(s, content, me.id, target))}>
            Move to nearest
          </button>
        </p>
        <p>
          <label>
            Skill{" "}
            <select value={skill} onChange={(e) => setSkill(e.target.value as Skill)}>
              {SKILLS.map((k) => (
                <option key={k} value={k}>
                  {capital(k)}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" onClick={() => onAct((s) => improveSkill(s, content, me.id, skill))}>
            Improve
          </button>
          <button type="button" onClick={() => onAct((s) => discardImprovement(s, content, me.id, skill))}>
            Discard improvement
          </button>
        </p>
      </details>
      <details>
        <summary>Cards</summary>
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
      </details>
      <details>
        <summary>Board</summary>
        <p>
          {state.gates.includes(me.space) && (
            <button type="button" onClick={() => onAct((s) => closeGate(s, content, me.id))}>
              Close gate
            </button>
          )}
          <button type="button" onClick={() => onAct((s) => spawnGateByText(s, content, me.id))}>
            Spawn gate
          </button>
          <button type="button" onClick={() => onAct((s) => spawnClueByText(s, content, me.id))}>
            Spawn clue
          </button>
          <button type="button" onClick={() => onAct((s) => spawnMonsterByText(s, content, me.id, space))}>
            Spawn monster on {spaceName(content, space)}
          </button>
          <button type="button" onClick={() => onAct((s) => spawnMonsterRandomly(s, content, me.id))}>
            Spawn monster on a random space
          </button>
          {" "}
          <label>
            Kind in the cup{" "}
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="">choose</option>
              {cupKinds.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.label}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" disabled={!kind} onClick={() => onAct((s) => spawnNamed(s, content, me.id, kind, space))}>
            Spawn named on {spaceName(content, space)}
          </button>
          {state.ongoingMythos.length > 0 && (
            <>
              {" "}
              <label>
                Ongoing card{" "}
                <select value={ongoing} onChange={(e) => setOngoing(e.target.value)}>
                  <option value="">choose</option>
                  {state.ongoingMythos.map((c) => (
                    <option key={c} value={c}>
                      {set.mythos.find((m) => m.id === c)?.name ?? c}
                    </option>
                  ))}
                </select>
              </label>{" "}
              <button type="button" disabled={!ongoing} onClick={() => onAct((s) => discardOngoing(s, content, ongoing))}>
                Discard ongoing card
              </button>
            </>
          )}
          {asideKinds.length > 0 && (
            <>
              {" "}
              <label>
                Set aside{" "}
                <select value={aside} onChange={(e) => setAside(e.target.value)}>
                  <option value="">choose</option>
                  {asideKinds.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </label>{" "}
              <button type="button" disabled={!aside} onClick={() => onAct((s) => spawnSetAside(s, content, me.id, aside, space))}>
                Spawn set-aside on {spaceName(content, space)}
              </button>
            </>
          )}
          {state.phase.name === "encounter" && (
            <button type="button" onClick={() => onAct((s) => ambush(s, content))}>
              Ambush
            </button>
          )}
        </p>
        <p>
          <button type="button" onClick={() => onAct((s) => placeToken(s, content, "rumor", space))}>
            Place rumor
          </button>
          <button type="button" onClick={() => onAct((s) => removeToken(s, content, "rumor", space))}>
            Remove rumor
          </button>
          <button type="button" onClick={() => onAct((s) => placeToken(s, content, "eldritch", space))}>
            Place eldritch
          </button>
          <button type="button" onClick={() => onAct((s) => removeToken(s, content, "eldritch", space))}>
            Remove eldritch
          </button>{" "}
          <label>
            Omen space{" "}
            <select value={omenSlot} onChange={(e) => setOmenSlot(Number(e.target.value))}>
              {OMEN_TRACK.map((c, n) => (
                <option key={n} value={n}>
                  {c} {n + 1}
                </option>
              ))}
            </select>
          </label>{" "}
          <button type="button" onClick={() => onAct((s) => changeEldritchOnOmen(s, omenSlot, 1))}>
            Add eldritch
          </button>
          <button type="button" onClick={() => onAct((s) => changeEldritchOnOmen(s, omenSlot, -1))}>
            Remove eldritch
          </button>
        </p>
      </details>
      <details>
        <summary>Monsters</summary>
        {!chosen && <p>no monster on the board</p>}
        {chosen && (
          <p>
            <label>
              Monster{" "}
              <select value={monsterKey(chosen)} onChange={(e) => setMonster(e.target.value)}>
                {state.monsters.map((m) => (
                  <option key={monsterKey(m)} value={monsterKey(m)}>
                    {set.monsters.find((x) => x.id === m.id)?.name ?? m.id} on {spaceName(content, m.space)}
                  </option>
                ))}
              </select>
            </label>{" "}
            <button type="button" onClick={() => onAct((s) => moveMonster(s, content, chosen, space))}>
              Move to {spaceName(content, space)}
            </button>
            <button type="button" onClick={() => onAct((s) => moveMonsterToward(s, content, chosen))}>
              Toward nearest investigator
            </button>
            <button type="button" onClick={() => onAct((s) => discardMonster(s, content, chosen))}>
              Discard
            </button>
          </p>
        )}
      </details>
      <details>
        <summary>Ancient One</summary>
        <p>
          <button type="button" onClick={() => onAct((s) => changeDoom(s, content, -1))}>
            Advance doom
          </button>
          <button type="button" onClick={() => onAct((s) => changeDoom(s, content, 1))}>
            Retreat doom
          </button>
          <button type="button" onClick={() => onAct((s) => solveMystery(s, content))}>
            Solve mystery
          </button>
          <button type="button" onClick={() => onAct((s) => changeMysteryTokens(s, 1))}>
            Place token on mystery
          </button>
          <button type="button" onClick={() => onAct((s) => changeMysteryTokens(s, -1))}>
            Remove token
          </button>
          {state.awakened && (
            <button type="button" onClick={() => onAct((s) => solveFinalMystery(s, content))}>
              Solve final mystery
            </button>
          )}
        </p>
      </details>
    </fieldset>
  );
}
