import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { badgeEvents, TOUCH_BADGE_MS } from "./badge";

describe("a badge shows on hover and for a moment after a touch", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it("follows the mouse in and out", () => {
    const shown: boolean[] = [];
    const b = badgeEvents((s) => shown.push(s));
    b.over("mouse");
    b.out("mouse");
    expect(shown).toEqual([true, false]);
  });
  it("stays after a touch and goes when the moment passes", () => {
    const shown: boolean[] = [];
    const b = badgeEvents((s) => shown.push(s));
    b.down("touch");
    b.over("touch");
    b.out("touch");
    expect(shown).toEqual([true, true]);
    vi.advanceTimersByTime(TOUCH_BADGE_MS - 1);
    expect(shown).toEqual([true, true]);
    vi.advanceTimersByTime(1);
    expect(shown).toEqual([true, true, false]);
  });
});
