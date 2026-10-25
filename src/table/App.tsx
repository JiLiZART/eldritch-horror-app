import { use, useMemo, useState } from "react";
import { activeGraph } from "../content/board";
import { content } from "../content/client";
import { travel } from "../engine/actions";
import { setupGame } from "../engine/setup";
import type { GameState, SetupOptions } from "../engine/types";
import { NewGame } from "./NewGame";
import { Panel } from "./Panel";
import { piecesOnSpace } from "./pieces";
import { Table } from "./Table";
import { type Act, Turn } from "./Turn";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function App() {
  const { board, set } = use(content);
  const [enabled, setEnabled] = useState(() => new Set(["eh01"]));
  const [selected, setSelected] = useState<string>();
  /** The game in progress, or the reason the last start was refused. */
  const [game, setGame] = useState<{ state?: GameState; error?: string }>({});
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
    } catch (e) {
      setGame({ error: message(e) });
    }
  };
  /** Runs an engine action; a refusal keeps the state and shows the rule. */
  const act: Act = (fn) => {
    try {
      setGame({ state: fn(game.state!) });
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
    <div className="layout">
      <main className="table">
        <Table board={board} pieces={pieces} enabled={enabled} selected={selectedSpace?.id} route={route} onSelect={select} reducedMotion={reducedMotion} />
      </main>
      <Panel board={board} set={set} state={game.state} pieces={pieces} spaces={spaces} enabled={enabled} onToggle={toggle} selected={selectedSpace} onSelect={select}>
        <NewGame set={set} running={game.state !== undefined} error={game.state ? undefined : game.error} onStart={start} onAbandon={() => setGame({})} />
        {game.state && <Turn board={board} set={set} state={game.state} error={game.error} route={route} onAct={act} onRoute={setRoute} />}
      </Panel>
    </div>
  );
}
