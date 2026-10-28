/** How long a badge stays after a touch, which cannot hover (touch-badges D1). */
export const TOUCH_BADGE_MS = 2000;

/** The badge's rule: the mouse shows and hides it as it comes and goes; a touch shows it and lets it go after a moment. */
export function badgeEvents(set: (shown: boolean) => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const linger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => set(false), TOUCH_BADGE_MS);
  };
  return {
    over: (pointerType: string) => {
      set(true);
      if (pointerType === "touch") linger();
    },
    out: (pointerType: string) => {
      if (pointerType === "touch") linger();
      else set(false);
    },
    down: (pointerType: string) => {
      if (pointerType === "touch") {
        set(true);
        linger();
      }
    },
  };
}
