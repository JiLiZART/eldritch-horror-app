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
import { clearGame, fileName, loadGame, parseGame, saveGame } from "./saved";
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
  const [game, setGame] = useState<{ state?: GameState; error?: string }>(() => {
    const { state, note } = loadGame(localStorage);
    return { state, error: note };
  });
  /** States before each accepted step this session, newest last (design D2). */
  const [history, setHistory] = useState<GameState[]>([]);
  useEffect(() => {
    if (game.state) saveGame(localStorage, game.state);
    else clearGame(localStorage);
  }, [game.state]);
  /** Travel route being picked on the table; undefined outside route mode (design D3). */
  const [route, setRoute] = useState<string[]>();
  const reducedMotion = usePrefersReducedMotion();
  const spaces = useMemo(() => activeGraph(board, enabled).spaces, [board, enabled]);
  const pieces = useMemo(() => piecesOnSpace(game.state, set), [game.state, set]);
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
      setGame({ state: setupGame({ board, set }, options) });
      setHistory([]);
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
        <Table board={board} labels={labels} strings={strings[lang]} pieces={pieces} enabled={enabled} selected={selectedSpace?.id} route={route} onSelect={select} reducedMotion={reducedMotion} />
      </main>
      <Panel board={board} set={set} lang={lang} onLang={chooseLang} state={game.state} pieces={pieces} spaces={spaces} enabled={enabled} onToggle={toggle} selected={selectedSpace} onSelect={select}>
        <NewGame
          set={set}
          running={game.state !== undefined}
          error={game.state ? undefined : game.error}
          onStart={start}
          onAbandon={() => {
            setGame({});
            setHistory([]);
          }}
          onSave={() => {
            const url = URL.createObjectURL(new Blob([JSON.stringify(game.state)], { type: "application/json" }));
            const a = Object.assign(document.createElement("a"), { href: url, download: fileName(game.state!) });
            a.click();
            URL.revokeObjectURL(url);
          }}
          onLoad={(text) => {
            const { state, note } = parseGame(text);
            if (state) {
              setGame({ state });
              setHistory([]);
              setRoute(undefined);
            } else setGame({ ...game, error: note });
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
