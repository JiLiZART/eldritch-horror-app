import { createContext, useContext, type ReactNode } from "react";
import type { Board, Lang } from "../content/types";

/** The panel's own words in the chosen language (design D2). */

export type Strings = Record<string, string>;

/** Looks a key up and fills `{name}` placeholders; a missing key comes back as the key, which the tests forbid. */
export function translate(strings: Strings, key: string, vars: Record<string, string | number> = {}): string {
  const text = strings[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

const LangContext = createContext<{ lang: Lang; strings: Strings }>({ lang: "en", strings: {} });

export function LangProvider({ lang, strings, children }: { lang: Lang; strings: Record<Lang, Strings>; children: ReactNode }) {
  return <LangContext.Provider value={{ lang, strings: strings[lang] }}>{children}</LangContext.Provider>;
}

/** The chosen language, for locale-aware formatting (slot-order D1). */
export function useLang(): Lang {
  return useContext(LangContext).lang;
}

/** The lookup for the current language. */
export function useT(): (key: string, vars?: Record<string, string | number>) => string {
  const { strings } = useContext(LangContext);
  return (key, vars) => translate(strings, key, vars);
}

/** A space's printed name in the chosen language, as the board shows it (space-names-language D1). */
export function spaceNameIn(board: Board, lang: Lang, id: string): string {
  return board.spaces.find((s) => s.id === id)?.name[lang] ?? id;
}

/** The space-name lookup for the current language. */
export function useSpaceName(): (board: Board, id: string) => string {
  const { lang } = useContext(LangContext);
  return (board, id) => spaceNameIn(board, lang, id);
}
