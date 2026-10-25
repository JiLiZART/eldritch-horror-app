import { describe, expect, it } from "vitest";
import { rng, shuffle } from "./rng";

describe("rng", () => {
  it("is reproducible from a seed and stays in [0, 1)", () => {
    const a = rng(42);
    const b = rng(42);
    for (let i = 0; i < 100; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
  it("differs between seeds", () => {
    expect(rng(1)()).not.toBe(rng(2)());
  });
});

describe("shuffle", () => {
  const items = Array.from({ length: 20 }, (_, i) => i);
  it("keeps every item once, reproducibly, without touching the input", () => {
    const a = shuffle(items, rng(7));
    const b = shuffle(items, rng(7));
    expect(a).toEqual(b);
    expect([...a].sort((x, y) => x - y)).toEqual(items);
    expect(items).toEqual(Array.from({ length: 20 }, (_, i) => i));
  });
  it("changes the order for some seed", () => {
    expect(shuffle(items, rng(7))).not.toEqual(items);
  });
});
