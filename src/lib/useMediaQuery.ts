import { useSyncExternalStore } from "react";

/**
 * Live media-query state that is `false` for the hydration pass, so components
 * that branch on it render the same tree on the server and the first client
 * render, then switch once mounted.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Drop-in for motion's `useReducedMotion`. Motion's reads the media query on
 * the first client render while the server saw `null`, so components that
 * branch on it (pinned tracks vs static lists) fail hydration for reduced-motion
 * users. This one reports `false` for the hydration pass and the real value
 * right after, then follows the OS setting live.
 */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
