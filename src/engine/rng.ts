export type Random = () => number;

/** splitmix32: small, seedable, good enough for shuffling cards. Returns numbers in [0, 1). */
export function rng(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x9e3779b9) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
    z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
    z ^= z >>> 15;
    return (z >>> 0) / 4294967296;
  };
}

/** Shuffles with the game seed and roll counter, like a test, so a replay reshuffles the same way. */
export function reshuffle<T>(state: { seed: number; rolls: number }, items: readonly T[]): { items: T[]; rolls: number } {
  return { items: shuffle(items, rng(state.seed * 31 + state.rolls)), rolls: state.rolls + 1 };
}

/** Fisher–Yates on a copy. */
export function shuffle<T>(items: readonly T[], random: Random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
