import type { Board, GameSet } from "../content/types";
import { takePossessions } from "../engine/effects";
import { continueFight, drawEncounter, encounterFallen, encounterRumor, fight, finishEncounter, monsterKey } from "../engine/encounter";
import { isDetained } from "../engine/types";
import type { EncounterPhase, GameState } from "../engine/types";
import { Dice } from "./Dice";
import { Effects } from "./Effects";
import { useT } from "./lang";
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
  const t = useT();
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
    state.decks.special.length + (state.encounterDiscards.special?.length ?? 0) > 0 && "special",
  ].filter((d): d is string => typeof d === "string");
  const ancientOne = set.ancientOnes.find((a) => a.id === state.ancientOne);
  const fallenHere = state.investigators.filter((i) => i.defeated && i.defeated !== "devoured" && !i.removed && i.id !== me.id && i.space === me.space);
  const fallenSheet = phase.card?.deck === "fallen" ? set.investigators.find((i) => i.id === phase.card?.id) : undefined;
  const cards = phase.card?.deck === "research" ? ancientOne?.research : phase.card?.deck === "special" ? ancientOne?.special : set.encounterDecks.find((d) => d.id === phase.card?.deck)?.cards;
  const card = cards?.find((c) => c.id === phase.card?.id);
  const detained = isDetained(me) ? set.cards.find((c) => me.conditions.includes(c.id) && /\/condition\/detained-\d+$/.test(c.id)) : undefined;
  return (
    <section className="turn">
      <h2>{t("encounter.heading", { round: state.round })}</h2>
      <p>{t("encounter.on", { name, space: space?.name.en ?? me.space })}</p>
      {detained && (
        <p className="cards">
          {detained.images.back && <img className="mythos-card" src={`/${detained.images.back}`} alt="Detained back" />} {t("encounter.detained", { name })}
        </p>
      )}
      {!detained && monsters.length > 0 && (
        <ul className="cards">
          {monsters.map((m) => {
            const sheet = set.monsters.find((x) => x.id === m.id);
            return (
              <li key={`${m.id}#${m.instance}`}>
                {sheet?.images.back && <img className="token" src={`/${sheet.images.back}`} alt={`${sheet.name} token back`} />} {t("encounter.healthLost", { name: sheet?.name ?? m.id, health: m.health })}{" "}
                {phase.fought.includes(monsterKey(m)) ? (
                  phase.combat?.monster.id === m.id && phase.combat.monster.instance === m.instance ? t("encounter.fighting") : t("encounter.fought")
                ) : phase.combat ? null : (
                  <button type="button" onClick={() => onAct((s) => fight(s, content, m))}>
                    {t("encounter.fight")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {phase.combat && (
        <p>
          {t("encounter.test", { skill: t(`skill.${phase.combat.step}`) })} <Dice set={set} state={state} roll={phase.combat.roll} onAct={onAct} /> {t("encounter.result", { result: phase.combat.roll.successes })}{" "}
          <button type="button" onClick={() => onAct((s) => continueFight(s, content))}>
            {t("encounter.continue")}
          </button>
        </p>
      )}
      {!detained && monsters.length === 0 && !phase.card && (
        <p>
          {decks.map((d) => (
            <button key={d} type="button" onClick={() => onAct((s) => drawEncounter(s, content, d))}>
              {t("encounter.draw", { deck: d })}
            </button>
          ))}
          {state.rumors.includes(me.space) && (
            <button type="button" onClick={() => onAct((s) => encounterRumor(s, content))}>
              {t("encounter.rumor")}
            </button>
          )}
        </p>
      )}
      {!detained && monsters.length === 0 && !phase.card && fallenHere.length > 0 && (
        <p>
          {fallenHere.map((f) => (
            <button key={f.id} type="button" onClick={() => onAct((s) => encounterFallen(s, content, f.id))}>
              {t("encounter.fallen", { name: set.investigators.find((i) => i.id === f.id)?.name ?? f.id })}
            </button>
          ))}
        </p>
      )}
      {fallenSheet && (
        <p className="cards">
          {fallenSheet.images.back && <img className="mythos-card" src={`/${fallenSheet.images.back}`} alt={`${fallenSheet.name} sheet back`} />}{" "}
          <button type="button" onClick={() => onAct((s) => takePossessions(s, content, me.id, fallenSheet.id))}>
            {t("encounter.takePossessions")}
          </button>
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
      <button type="button" disabled={!detained && unfought.length > 0} onClick={() => onAct((s) => finishEncounter(s, content))}>
        {t("encounter.finish")}
      </button>
      <Effects key={phase.active} board={board} set={set} state={state} who={phase.active} onAct={onAct} />
      <p aria-live="assertive" className="error">
        {error}
      </p>
      <p>
        <small>{t("encounter.note")}</small>
      </p>
    </section>
  );
}
