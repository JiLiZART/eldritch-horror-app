import type { Board, GameSet } from "../content/types";
import { continueFight, drawEncounter, fight, finishEncounter, monsterKey } from "../engine/encounter";
import type { EncounterPhase, GameState } from "../engine/types";
import { Dice } from "./Dice";
import { Effects } from "./Effects";
import type { Act } from "./Turn";

interface EncounterProps {
  board: Board;
  set: GameSet;
  state: GameState;
  phase: EncounterPhase;
  error: string | undefined;
  onAct: Act;
}

/** The Encounter phase beside the board (design D5): the monsters to fight, the decks the space allows, the drawn card. Rules stay in the engine. */
export function Encounter({ board, set, state, phase, error, onAct }: EncounterProps) {
  const content = { board, set };
  const me = state.investigators.find((i) => i.id === phase.active)!;
  const space = board.spaces.find((s) => s.id === me.space);
  const name = set.investigators.find((i) => i.id === me.id)?.name ?? me.id;
  const monsters = state.monsters.filter((m) => m.space === me.space);
  const unfought = monsters.filter((m) => !phase.fought.includes(monsterKey(m)));
  const decks = [
    space?.region,
    "general",
    state.clues.includes(me.space) && "research",
    state.gates.includes(me.space) && "other-world",
    state.activeExpedition === me.space && "expedition",
  ].filter((d): d is string => typeof d === "string");
  const cards = phase.card?.deck === "research" ? set.ancientOnes.find((a) => a.id === state.ancientOne)?.research : set.encounterDecks.find((d) => d.id === phase.card?.deck)?.cards;
  const card = cards?.find((c) => c.id === phase.card?.id);
  return (
    <section className="turn">
      <h2>Round {state.round}, Encounter phase</h2>
      <p>
        {name} encounters on {space?.name.en ?? me.space}
      </p>
      {monsters.length > 0 && (
        <ul className="cards">
          {monsters.map((m) => {
            const sheet = set.monsters.find((x) => x.id === m.id);
            return (
              <li key={`${m.id}#${m.instance}`}>
                {sheet?.images.back && <img className="token" src={`/${sheet.images.back}`} alt={`${sheet.name} token back`} />} {sheet?.name ?? m.id}, {m.health} health lost{" "}
                {phase.fought.includes(monsterKey(m)) ? (
                  phase.combat?.monster.id === m.id && phase.combat.monster.instance === m.instance ? "(fighting)" : "(fought)"
                ) : phase.combat ? null : (
                  <button type="button" onClick={() => onAct((s) => fight(s, content, m))}>
                    Fight
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {phase.combat && (
        <p>
          {phase.combat.step === "will" ? "Will" : "Strength"} test <Dice set={set} state={state} roll={phase.combat.roll} onAct={onAct} /> result {phase.combat.roll.successes}{" "}
          <button type="button" onClick={() => onAct((s) => continueFight(s, content))}>
            Continue
          </button>
        </p>
      )}
      {monsters.length === 0 && !phase.card && (
        <p>
          {decks.map((d) => (
            <button key={d} type="button" onClick={() => onAct((s) => drawEncounter(s, content, d))}>
              Draw {d}
            </button>
          ))}
        </p>
      )}
      {card && (
        <p className="cards">
          <img className="mythos-card" src={`/${card.images.front}`} alt={`${phase.card?.deck} encounter ${card.name}`} />
        </p>
      )}
      <ol>
        {phase.log.map((line, n) => (
          <li key={n}>{line}</li>
        ))}
      </ol>
      <button type="button" disabled={unfought.length > 0} onClick={() => onAct((s) => finishEncounter(s, content))}>
        Finish
      </button>
      <Effects key={phase.active} board={board} set={set} state={state} who={phase.active} onAct={onAct} />
      <p aria-live="assertive" className="error">
        {error}
      </p>
      <p>
        <small>Card text and token text are left to the players; defeated investigators are not replaced; Detained is applied by the players.</small>
      </p>
    </section>
  );
}
