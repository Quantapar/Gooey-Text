import { useCallback, useEffect, useState } from "react";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export interface GooeyKeyboardState {
  /** The current character, in the active case (e.g. "a" or "A"). */
  char: string;
  /** Whether capitals are active — driven by the keyboard (web) or toggle (mobile). */
  caps: boolean;
  /** Step to the previous letter in the alphabet (wraps). For mobile arrows. */
  prev: () => void;
  /** Step to the next letter in the alphabet (wraps). For mobile arrows. */
  next: () => void;
  /** Turn capitals on/off. For the mobile toggle. */
  setCaps: (on: boolean) => void;
}

/**
 * Drives the current letter on every device:
 *
 * - Web: type any letter — Shift / CapsLock set the case, exactly as before.
 * - Mobile (no physical keyboard): the `prev`/`next`/`setCaps` controls let the
 *   on-screen arrows step through the alphabet and the toggle flip capitals.
 *
 * Internally we track a base lowercase letter plus a `caps` flag, so the source
 * (keyboard or buttons) doesn't matter — `char` is the cased result.
 */
export function useGooeyKeyboard(initial = "a"): GooeyKeyboardState {
  const [letter, setLetter] = useState(initial.toLowerCase());
  const [caps, setCaps] = useState(/[A-Z]/.test(initial));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[a-zA-Z]$/.test(e.key)) {
        setLetter(e.key.toLowerCase());
        setCaps(e.key !== e.key.toLowerCase()); // uppercase key → caps on
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const step = useCallback((dir: number) => {
    setLetter((cur) => {
      const i = Math.max(0, ALPHABET.indexOf(cur));
      return ALPHABET.charAt((i + dir + 26) % 26);
    });
  }, []);
  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  return { char: caps ? letter.toUpperCase() : letter, caps, prev, next, setCaps };
}
