import { use, useEffect, useMemo, useState } from "react";
import { activeGraph } from "../content/board";
import { content } from "../content/client";
import { travel } from "../engine/actions";
import { setupGame } from "../engine/setup";
import type { Lang } from "../content/types";
import type { GameState, SetupOptions } from "../engine/types";
import { Encounter } from "./Encounter";
import { Mythos } from "./Mythos";
import { NewGame } from "./NewGame";
import { Panel } from "./Panel";
import { LangProvider, useT } from "./lang";
import { piecesOnSpace } from "./pieces";
import { fileName, loadGame, loadSlots, newSlotId, parseGame, removeGame, saveGame, slotName } from "./saved";
import { Table } from "./Table";
import { type Act, Turn } from "./Turn";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const LANG_KEY = "eh.board-lang";

/** Remembered board language; otherwise Russian for a Russian-preferring browser. */
function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ru") return saved;
  } catch {}
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function App() {
  const { board, set, labels, strings, panel } = use(content);
  const [lang, setLang] = useState(initialLang);
  const chooseLang = (next: Lang) => {
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  };
  const [enabled, setEnabled] = useState(() => new Set(["eh01"]));
  const [selected, setSelected] = useState<string>();
  /** The game in progress (resumed from the browser's slot), or the reason the last start was refused. */
  const [slots, setSlots] = useState(() => loadSlots(localStorage));
  /** The slot the game in progress is saved to (save-slots D2). */
  const [slot, setSlot] = useState<string | undefined>(slots.current);
  const [resumed] = useState(() => (slots.current ? loadGame(localStorage, slots.current) : {}));
  const [game, setGame] = useState<{ state?: GameState; error?: string }>({ state: resumed.state, error: resumed.note });
  /** States before each accepted step, newest last, saved with the slot (undo-across-reload D2). */
  const [history, setHistory] = useState<GameState[]>(resumed.history ?? []);
  useEffect(() => {
    if (!game.state || !slot) return;
    saveGame(localStorage, slot, game.state, slotName(game.state, set.ancientOnes.find((a) => a.id === game.state!.ancientOne)?.name ?? game.state.ancientOne), history);
    setSlots(loadSlots(localStorage));
  }, [game.state, slot, set, history]);
  /** Opens a game in a fresh slot (a start or a loaded file). */
  const openNew = (state: GameState) => {
    setSlot(newSlotId());
    setGame({ state });
    setHistory([]);
    setRoute(undefined);
  };
  /** Puts the game in progress aside and shows the form; its slot stays saved. */
  const leave = () => {
    setSlot(undefined);
    setGame({});
    setHistory([]);
    setRoute(undefined);
  };
  /** Travel route being picked on the table; undefined outside route mode (design D3). */
  const [route, setRoute] = useState<string[]>();
  // The camera follows the turn (follow-active D1): keyed on the active investigator, not their space, and never mid-route.
  const phase = game.state?.phase;
  const activeId = phase?.name === "action" || phase?.name === "encounter" ? phase.active : undefined;
  const picking = route !== undefined;
  useEffect(() => {
    if (!activeId || picking) return;
    const space = game.state?.investigators.find((i) => i.id === activeId)?.space;
    if (space) setSelected(space);
  }, [activeId, picking]);
  const reducedMotion = usePrefersReducedMotion();
  const spaces = useMemo(() => activeGraph(board, enabled).spaces, [board, enabled]);
  const pieces = useMemo(() => piecesOnSpace(game.state, set), [game.state, set]);
  const ancientOne = set.ancientOnes.find((a) => a.id === game.state?.ancientOne);
  const front = (id: string) => set.cards.find((c) => c.id === id)?.images.front;
  const sheets = game.state?.investigators
    .filter((i) => !i.removed)
    .map((i) => ({ image: set.investigators.find((x) => x.id === i.id)?.images.front, held: [...i.possessions, ...i.conditions].map(front).filter((c): c is string => !!c), health: i.health, sanity: i.sanity }))
    .filter((s): s is { image: string; held: string[]; health: number; sanity: number } => !!s.image);
  const tableau = game.state && ancientOne && { sheet: game.state.awakened && ancientOne.images.back ? ancientOne.images.back : ancientOne.images.front, mystery: ancientOne.mysteries.find((m) => m.id === game.state!.currentMystery)?.images.front, mythos: game.state.ongoingMythos.map((id) => set.mythos.find((m) => m.id === id)?.images.front).filter((i): i is string => !!i) };
  const selectedSpace = spaces.find((s) => s.id === selected);
  const toggle = (id: string, on: boolean) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  const message = (e: unknown) => (e instanceof Error ? e.message : String(e));
  const start = (options: SetupOptions) => {
    try {
      openNew(setupGame({ board, set }, options));
    } catch (e) {
      setGame({ error: message(e) });
    }
  };
  /** Runs an engine action; a refusal keeps the state and shows the rule. */
  const act: Act = (fn) => {
    try {
      const before = game.state!;
      setGame({ state: fn(before) });
      setHistory((prev) => [...prev, before]);
      setRoute(undefined);
    } catch (e) {
      setGame({ state: game.state, error: message(e) });
    }
  };
  /** In route mode a selected space extends the route when the engine accepts the draft. */
  const select = (id: string | undefined) => {
    if (!route) return setSelected(id);
    if (!id) return;
    const draft = [...route, id];
    try {
      travel(game.state!, board, draft);
      setRoute(draft);
      setGame({ state: game.state });
    } catch (e) {
      setGame({ state: game.state, error: message(e) });
    }
  };
  return (
    <LangProvider lang={lang} strings={panel}>
    <div className="layout">
      <main className="table">
        <Table board={board} labels={labels} strings={strings[lang]} pieces={pieces} tracks={game.state && { doom: game.state.doom, omen: game.state.omen, eldritch: [...game.state.eldritchOnOmen], reserve: game.state.reserve.map((id) => set.cards.find((c) => c.id === id)?.images.front).filter((i): i is string => !!i) }} tableau={tableau} sheets={sheets} enabled={enabled} selected={selectedSpace?.id} route={route} onSelect={select} reducedMotion={reducedMotion} />
      </main>
      <Panel board={board} set={set} lang={lang} onLang={chooseLang} state={game.state} pieces={pieces} spaces={spaces} enabled={enabled} onToggle={toggle} selected={selectedSpace} onSelect={select}>
        <NewGame
          set={set}
          running={game.state !== undefined}
          error={game.state ? undefined : game.error}
          onStart={start}
          onAbandon={() => {
            if (slot) setSlots(removeGame(localStorage, slot));
            leave();
          }}
          onNew={leave}
          slots={slots.slots}
          current={slot}
          onSwitch={(id) => {
            const { state, history, note } = loadGame(localStorage, id);
            if (!state) return setGame({ ...game, error: note });
            setSlot(id);
            setGame({ state });
            setHistory(history ?? []);
            setRoute(undefined);
          }}
          onRemove={(id) => {
            setSlots(removeGame(localStorage, id));
            if (id === slot) leave();
          }}
          onSave={() => {
            const url = URL.createObjectURL(new Blob([JSON.stringify(game.state)], { type: "application/json" }));
            const a = Object.assign(document.createElement("a"), { href: url, download: fileName(game.state!) });
            a.click();
            URL.revokeObjectURL(url);
          }}
          onLoad={(text) => {
            const { state, note } = parseGame(text);
            if (state) openNew(state);
            else setGame({ ...game, error: note });
          }}
          canUndo={history.length > 0}
          onUndo={() => {
            setGame({ state: history.at(-1) });
            setHistory((prev) => prev.slice(0, -1));
            setRoute(undefined);
          }}
        />
        {game.state?.phase.name === "action" && <Turn board={board} set={set} state={game.state} phase={game.state.phase} error={game.error} route={route} onAct={act} onRoute={setRoute} />}
        {game.state?.phase.name === "encounter" && <Encounter board={board} set={set} state={game.state} phase={game.state.phase} error={game.error} onAct={act} />}
        {game.state?.phase.name === "mythos" && <Mythos board={board} set={set} state={game.state} phase={game.state.phase} error={game.error} onAct={act} />}
        {game.state?.phase.name === "won" && (
          <section className="turn">
            <Heading k="app.win" />
            <p>{game.state.phase.reason}</p>
          </section>
        )}
        {game.state?.phase.name === "lost" && (
          <section className="turn">
            <Heading k="app.lose" />
            <p>{game.state.phase.reason}</p>
          </section>
        )}
      </Panel>
    </div>
    </LangProvider>
  );
}

/** A translated heading inside the provider. */
function Heading({ k }: { k: string }) {
  const t = useT();
  return <h2>{t(k)}</h2>;
}
