import { use, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { activeGraph } from "../content/board";
import { content } from "../content/client";
import { travel } from "../engine/actions";
import { OMEN_TRACK } from "../engine/omen";
import { setupGame } from "../engine/setup";
import type { Lang } from "../content/types";
import type { GameState, SetupOptions } from "../engine/types";
import { Encounter } from "./Encounter";
import { Mythos } from "./Mythos";
import { NewGame } from "./NewGame";
import { type FocusCard, journalLine, Panel } from "./Panel";
import { LangProvider, translate, useT } from "./lang";
import { piecesOnSpace } from "./pieces";
import { duplicateGame, exportAll, fileName, gameKey, importAll, INDEX_KEY, loadGame, loadSlots, newSlotId, parseGame, removeGame, renameGame, saveGame, slotName } from "./saved";
import { type CardFace, Table, type TableProps } from "./Table";
import { type Act, Turn } from "./Turn";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const LANG_KEY = "eh.board-lang";
/** Remembers that the panel is hidden for a table-only screen (panel-toggle D1). */
const PANEL_KEY = "eh.panel-hidden";
/** Remembers the panel's width in pixels (panel-width D1). */
const WIDTH_KEY = "eh.panel-width";
const clampWidth = (w: number) => Math.min(Math.max(w, 256), window.innerWidth / 2);

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
  const [panelHidden, setPanelHidden] = useState(() => {
    try {
      return localStorage.getItem(PANEL_KEY) === "1";
    } catch {
      return false;
    }
  });
  const showPanel = (shown: boolean) => {
    setPanelHidden(!shown);
    try {
      localStorage.setItem(PANEL_KEY, shown ? "0" : "1");
    } catch {}
  };
  const [panelWidth, setPanelWidth] = useState<number | undefined>(() => {
    try {
      const saved = Number(localStorage.getItem(WIDTH_KEY));
      return saved > 0 ? clampWidth(saved) : undefined;
    } catch {
      return undefined;
    }
  });
  /** Dragging the panel's edge sets its width (panel-width D2). */
  const dragPanel = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => setPanelWidth(clampWidth(window.innerWidth - ev.clientX));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setPanelWidth((w) => {
        try {
          if (w) localStorage.setItem(WIDTH_KEY, String(Math.round(w)));
        } catch {}
        return w;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
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
  /** States undone this session, newest last; any accepted step drops them (redo D1). */
  const [redo, setRedo] = useState<GameState[]>([]);
  /** Set when the state came from another window's save, so this window does not save it back (window-sync D1). */
  const followed = useRef(false);
  useEffect(() => {
    if (!game.state || !slot) return;
    if (followed.current) {
      followed.current = false;
      return;
    }
    saveGame(localStorage, slot, game.state, slotName(game.state, set.ancientOnes.find((a) => a.id === game.state!.ancientOne)?.name ?? game.state.ancientOne), history);
    setSlots(loadSlots(localStorage));
  }, [game.state, slot, set, history]);
  // Another window of this browser saving the same slot moves this one along with it (window-sync D1).
  useEffect(() => {
    const follow = (e: StorageEvent) => {
      // The slot list follows slots made, named, duplicated or removed elsewhere (window-sync-slots D1).
      if (e.key === INDEX_KEY) {
        const index = loadSlots(localStorage);
        setSlots(index);
        if (slot && !index.slots.some((s) => s.id === slot)) leave();
        return;
      }
      if (!slot || e.key !== gameKey(slot)) return;
      const { state, history } = loadGame(localStorage, slot);
      if (!state) return;
      followed.current = true;
      setGame({ state });
      setHistory(history ?? []);
      setRedo([]);
    };
    window.addEventListener("storage", follow);
    return () => window.removeEventListener("storage", follow);
  }, [slot]);
  /** Makes a saved slot the game in progress. */
  const switchTo = (id: string) => {
    const { state, history, note } = loadGame(localStorage, id);
    if (!state) return setGame({ ...game, error: note });
    setSlot(id);
    setGame({ state });
    setHistory(history ?? []);
    setRedo([]);
    setRoute(undefined);
  };
  /** Opens a game in a fresh slot (a start or a loaded file). */
  const openNew = (state: GameState) => {
    setSlot(newSlotId());
    setGame({ state });
    setHistory([]);
    setRedo([]);
    setRoute(undefined);
  };
  /** Puts the game in progress aside and shows the form; its slot stays saved. */
  const leave = () => {
    setSlot(undefined);
    setGame({});
    setHistory([]);
    setRedo([]);
    setRoute(undefined);
  };
  /** Travel route being picked on the table; undefined outside route mode (design D3). */
  const [route, setRoute] = useState<string[]>();
  // The camera follows the turn (follow-active D1): keyed on the active investigator, not their space, and never mid-route.
  const phase = game.state?.phase;
  const t = useMemo(() => (key: string, vars?: Record<string, string | number>) => translate(panel[lang], key, vars), [panel, lang]);
  const activeId = phase?.name === "action" || phase?.name === "encounter" ? phase.active : undefined;
  /** The table's corner line: round, phase and whose turn, or the outcome (table-status-line D1). */
  const lastEntry = game.state?.journal.at(-1);
  /** The roll waiting on the players, shown on the table (table-dice D1). */
  const openRoll = phase?.name === "action" ? phase.acquiring : phase?.name === "encounter" ? phase.combat?.roll : undefined;
  const status = !game.state || !phase
    ? undefined
    : {
        line:
          phase.name === "won" || phase.name === "lost"
            ? t(phase.name === "won" ? "app.win" : "app.lose")
            : [
                t("panel.round", { round: game.state.round }),
                t(`journal.${phase.name}`),
                activeId && set.investigators.find((i) => i.id === activeId)?.name,
                // Doom and the omen for a far screen (table-status-tracks D1).
                t("track.doom", { doom: game.state.doom }),
                t("track.omen", { omen: t(`omen.${OMEN_TRACK[game.state.omen]}`), count: game.state.eldritchOnOmen[game.state.omen] ?? 0 }),
              ]
                .filter(Boolean)
                .join(" · "),
        ...(lastEntry ? { last: journalLine(lastEntry, set, t) } : {}),
        ...(openRoll ? { dice: t("table.roll", { name: set.investigators.find((i) => i.id === openRoll.investigator)?.name ?? openRoll.investigator, dice: openRoll.dice.map((d) => (d >= 5 ? `[${d}]` : `${d}`)).join(" ") }) } : {}),
      };
  const picking = route !== undefined;
  useEffect(() => {
    if (!activeId || picking) return;
    const space = game.state?.investigators.find((i) => i.id === activeId)?.space;
    if (space) setSelected(space);
  }, [activeId, picking]);
  const reducedMotion = usePrefersReducedMotion();
  // Escape clears the selection, or cancels the route being picked (escape-clears-selection D1); form fields keep their own Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;
      // Arrows pan by a fifth of the view, plus and minus zoom a step (keyboard-pan-zoom D1).
      const step: Record<string, [number, number, number]> = { ArrowLeft: [-0.2, 0, 1], ArrowRight: [0.2, 0, 1], ArrowUp: [0, 0.2, 1], ArrowDown: [0, -0.2, 1], "+": [0, 0, 1.25], "=": [0, 0, 1.25], "-": [0, 0, 0.8] };
      const nudgeBy = step[e.key];
      if (nudgeBy) {
        e.preventDefault();
        setNudge((prev) => ({ dx: nudgeBy[0], dy: nudgeBy[1], zoom: nudgeBy[2], key: (prev?.key ?? 0) + 1 }));
        return;
      }
      // The platform's undo and redo keys (keyboard-undo D1).
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "y")) {
        e.preventDefault();
        if (e.key.toLowerCase() === "y" || e.shiftKey) redoStep();
        else undo();
        return;
      }
      if (e.key !== "Escape") return;
      if (cardUp.current) {
        fitTable();
        return;
      }
      if (picking) {
        setRoute(undefined);
        const space = game.state?.investigators.find((i) => i.id === activeId)?.space;
        setSelected(space);
      } else setSelected(undefined);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [picking, activeId, game.state, history, redo]);
  /** Bumped by Fit table; the rig glides to the whole table on each change (fit-view D1). */
  const [fit, setFit] = useState(0);
  /** A card is up to read; Escape puts it down by fitting the table first (escape-refits D1). */
  const cardUp = useRef(false);
  const fitTable = () => {
    cardUp.current = false;
    setFit((n) => n + 1);
  };
  /** The card the panel asked to bring up on the table (panel-card-focus D1). */
  const [cardFocus, setCardFocus] = useState<TableProps["focus"]>();
  /** A keyboard pan or zoom request for the rig (keyboard-pan-zoom D1). */
  const [nudge, setNudge] = useState<TableProps["nudge"]>();
  const focusCard: FocusCard = (place, index, seat) => {
    cardUp.current = true;
    setCardFocus((prev) => ({ place, index, ...(seat === undefined ? {} : { seat }), key: (prev?.key ?? 0) + 1 }));
  };
  const spaces = useMemo(() => activeGraph(board, enabled).spaces, [board, enabled]);
  const pieces = useMemo(() => piecesOnSpace(game.state, board, set, t), [game.state, board, set, t]);
  const ancientOne = set.ancientOnes.find((a) => a.id === game.state?.ancientOne);
  /** A card's face for the table, named for its hover badge (card-hover D1); undefined for an unknown id. */
  const face = (id: string, value?: true) => {
    const card = set.cards.find((c) => c.id === id);
    return card && { image: card.images.front, label: value ? `${card.name} · ${t("status.value", { value: card.value ?? 0 })}` : card.name, ...(card.images.back ? { back: card.images.back } : {}) };
  };
  const known = (c: CardFace | undefined): c is CardFace => !!c;
  /** The encounter card being resolved, as a face for the active investigator's sheet (encounter-card-on-table D1). */
  const encounterFace = (() => {
    if (phase?.name !== "encounter" || !phase.card) return undefined;
    const drawn = phase.card;
    const cards = drawn.deck === "research" ? ancientOne?.research : drawn.deck === "special" ? ancientOne?.special : set.encounterDecks.find((d) => d.id === drawn.deck)?.cards;
    const card = cards?.find((c) => c.id === drawn.id);
    return card && { image: card.images.front, label: card.name };
  })();
  const sheets = game.state?.investigators
    .filter((i) => !i.removed)
    .map((i) => {
      const printed = set.investigators.find((x) => x.id === i.id);
      return { sheet: printed && { image: printed.images.front, label: printed.name }, ...(activeId === i.id && encounterFace ? { encounter: encounterFace } : {}), held: [...i.possessions, ...i.conditions].map((id) => face(id)).filter(known), health: i.health, sanity: i.sanity, improvements: i.improvements, tickets: i.tickets, ...(i.defeated ? { defeated: true } : {}) };
    })
    .filter((s): s is NonNullable<TableProps["sheets"]>[number] => !!s.sheet);
  const mystery = ancientOne?.mysteries.find((m) => m.id === game.state?.currentMystery);
  const tableau = game.state &&
    ancientOne && {
      sheet: { image: game.state.awakened && ancientOne.images.back ? ancientOne.images.back : ancientOne.images.front, label: ancientOne.name },
      mystery: mystery && { image: mystery.images.front, label: mystery.name },
      // The card drawn this round lies first while the Mythos phase lasts (mythos-card-on-table D1).
      mythos: (phase?.name === "mythos" ? [phase.card, ...game.state.ongoingMythos.filter((id) => id !== phase.card)] : game.state.ongoingMythos)
        .map((id) => set.mythos.find((m) => m.id === id))
        .filter((m) => m !== undefined)
        .map((m) => ({ image: m.images.front, label: m.name })),
      tokens: game.state.mysteryTokens,
    };
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
  /** Takes back the last accepted step, keeping it for Redo (redo D1). */
  const undo = () => {
    const before = history.at(-1);
    if (!before) return;
    setRedo((prev) => [...prev, game.state!]);
    setGame({ state: before });
    setHistory((prev) => prev.slice(0, -1));
    setRoute(undefined);
  };
  /** Reapplies the last undone step. */
  const redoStep = () => {
    const next = redo.at(-1);
    if (!next) return;
    setHistory((prev) => [...prev, game.state!]);
    setRedo((prev) => prev.slice(0, -1));
    setGame({ state: next });
    setRoute(undefined);
  };
  /** Runs an engine action; a refusal keeps the state and shows the rule. */
  const act: Act = (fn) => {
    try {
      const before = game.state!;
      setGame({ state: fn(before) });
      setHistory((prev) => [...prev, before]);
      setRedo([]);
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
    <div className={panelHidden ? "layout panel-hidden" : "layout"} style={panelWidth ? ({ "--panel-width": `${panelWidth}px` } as React.CSSProperties) : undefined}>
      {panelHidden && (
        <button type="button" className="show-panel" onClick={() => showPanel(true)}>
          <Text k="game.showPanel" />
        </button>
      )}
      <main className="table">
        <Table board={board} labels={labels} strings={strings[lang]} pieces={pieces} tracks={game.state && { doom: game.state.doom, omen: game.state.omen, eldritch: [...game.state.eldritchOnOmen], reserve: game.state.reserve.map((id) => face(id, true)).filter(known), labels: { doom: t("track.doom", { doom: game.state.doom }), omen: t("track.omen", { omen: t(`omen.${OMEN_TRACK[game.state.omen]}`), count: game.state.eldritchOnOmen[game.state.omen] ?? 0 }), eldritch: OMEN_TRACK.map((c) => t("track.eldritch", { omen: t(`omen.${c}`) })) } }} tableau={tableau} sheets={sheets} fit={fit} focus={cardFocus} nudge={nudge} status={status} enabled={enabled} selected={selectedSpace?.id} route={route} onSelect={select} onFit={fitTable} onCardUp={() => (cardUp.current = true)} reducedMotion={reducedMotion} />
      </main>
      {!panelHidden && <div className="panel-handle" role="separator" aria-orientation="vertical" aria-label={translate(panel[lang], "panel.resize")} onPointerDown={dragPanel} />}
      {!panelHidden && <Panel board={board} set={set} lang={lang} onLang={chooseLang} state={game.state} pieces={pieces} spaces={spaces} enabled={enabled} onToggle={toggle} selected={selectedSpace} onSelect={select} onHidePanel={() => showPanel(false)} onFocusCard={focusCard}>
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
          onSwitch={switchTo}
          onRename={(id, title) => setSlots(renameGame(localStorage, id, title))}
          onDuplicate={(id) => switchTo(duplicateGame(localStorage, id))}
          onRemove={(id) => {
            setSlots(removeGame(localStorage, id));
            if (id === slot) leave();
          }}
          onSave={() => {
            const url = URL.createObjectURL(new Blob([JSON.stringify(game.state)], { type: "application/json" }));
            const a = Object.assign(document.createElement("a"), { href: url, download: fileName(game.state!, slots.slots.find((s) => s.id === slot)?.title) });
            a.click();
            URL.revokeObjectURL(url);
          }}
          onLoad={(text) => {
            const { state, note } = parseGame(text);
            if (state) openNew(state);
            else setGame({ ...game, error: note });
          }}
          onBackup={() => {
            const url = URL.createObjectURL(new Blob([exportAll(localStorage)], { type: "application/json" }));
            const a = Object.assign(document.createElement("a"), { href: url, download: "eldritch-horror-backup.json" });
            a.click();
            URL.revokeObjectURL(url);
          }}
          onRestore={(text) => {
            try {
              const { added, skipped } = importAll(localStorage, text);
              setSlots(loadSlots(localStorage));
              setGame({ ...game, error: t("game.restored", { added, skipped }) });
            } catch (e) {
              setGame({ ...game, error: message(e) });
            }
          }}
          onFit={fitTable}
          canUndo={history.length > 0}
          onUndo={undo}
          canRedo={redo.length > 0}
          onRedo={redoStep}
        />
        {game.state?.phase.name === "action" && <Turn board={board} set={set} state={game.state} phase={game.state.phase} error={game.error} route={route} onAct={act} onRoute={setRoute} onFocusCard={focusCard} />}
        {game.state?.phase.name === "encounter" && <Encounter board={board} set={set} state={game.state} phase={game.state.phase} error={game.error} onAct={act} onFocusCard={focusCard} />}
        {game.state?.phase.name === "mythos" && <Mythos board={board} set={set} state={game.state} phase={game.state.phase} error={game.error} onAct={act} onFocusCard={focusCard} />}
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
      </Panel>}
    </div>
    </LangProvider>
  );
}

/** A translated heading inside the provider. */
function Heading({ k }: { k: string }) {
  const t = useT();
  return <h2>{t(k)}</h2>;
}

/** A translated text inside the provider. */
function Text({ k }: { k: string }) {
  const t = useT();
  return <>{t(k)}</>;
}
