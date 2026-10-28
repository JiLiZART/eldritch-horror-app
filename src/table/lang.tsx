import { createContext, useContext, type ReactNode } from "react";
import type { Lang } from "../content/types";

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

/** The lookup for the current language. */
export function useT(): (key: string, vars?: Record<string, string | number>) => string {
  const { strings } = useContext(LangContext);
  return (key, vars) => translate(strings, key, vars);
}
