import { use, useMemo, useState } from "react";
import { activeGraph } from "../content/board";
import { content } from "../content/client";
import { Panel } from "./Panel";
import { Table } from "./Table";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function App() {
  const { board, investigators } = use(content);
  const [enabled, setEnabled] = useState(() => new Set(["eh01"]));
  const [selected, setSelected] = useState<string>();
  const reducedMotion = usePrefersReducedMotion();
  const spaces = useMemo(() => activeGraph(board, enabled).spaces, [board, enabled]);
  const selectedSpace = spaces.find((s) => s.id === selected);
  const toggle = (id: string, on: boolean) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  return (
    <div className="layout">
      <main className="table">
        <Table board={board} investigators={investigators} enabled={enabled} selected={selectedSpace?.id} onSelect={setSelected} reducedMotion={reducedMotion} />
      </main>
      <Panel board={board} spaces={spaces} enabled={enabled} onToggle={toggle} selected={selectedSpace} onSelect={setSelected} />
    </div>
  );
}
