import { useEffect, useRef, useState } from "react";

export interface GooeyKeyboardState {
  /** The current character, in the case typed (e.g. "a" or "A"). */
  char: string;
  /** True when the current character is a capital — driven by the keyboard. */
  caps: boolean;
  /**
   * Attach to a visually-hidden <input>. It's what summons the on-screen
   * keyboard on phones/tablets (which only appears when an input is focused).
   */
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const isLetter = (s: string | null): s is string => !!s && /^[a-zA-Z]$/.test(s);

/**
 * Tracks the last letter typed, on every device:
 *
 * - Desktop: type anywhere — a hidden input is auto-focused, and a window-level
 *   keydown is a fallback if focus is ever lost.
 * - Touch: tapping anywhere focuses the hidden input, which opens the on-screen
 *   keyboard. We read the typed letter from the `beforeinput` event (`e.data`),
 *   which reports the real character regardless of the keyboard — `keydown` is
 *   unreliable on mobile (many keyboards report no/garbage key codes).
 *
 * Case comes straight from what was typed, so Shift / CapsLock produce capitals.
 */
export function useGooeyKeyboard(initial = "a"): GooeyKeyboardState {
  const [char, setChar] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    // The reliable cross-keyboard signal: the character about to be inserted.
    function onBeforeInput(e: InputEvent) {
      if (isLetter(e.data)) setChar(e.data);
    }
    // Keep the field empty so it never grows a value, caret, or scroll.
    function onInput() {
      if (inputRef.current) inputRef.current.value = "";
    }

    // Tap anywhere (except links/buttons) refocuses, so the mobile keyboard
    // stays up and desktop stays "type anywhere". Must run inside the gesture
    // for iOS to open the keyboard.
    function onPointerDown(e: PointerEvent) {
      // Don't steal taps meant for links/buttons (e.target may be a non-Element
      // like window, so guard before calling closest()).
      const target = e.target;
      if (target instanceof Element && target.closest("a, button, input, textarea, select")) return;
      inputRef.current?.focus({ preventScroll: true });
    }

    // Desktop fallback: if the hidden input ever loses focus, typing still works.
    function onKey(e: KeyboardEvent) {
      if (document.activeElement === input) return; // input path already handles it
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isLetter(e.key)) setChar(e.key);
    }

    input.addEventListener("beforeinput", onBeforeInput);
    input.addEventListener("input", onInput);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);

    // On a pointer device (desktop) focus immediately so you can just type.
    // On touch we wait for a tap, matching the "tap, then type" hint.
    const isTouch = window.matchMedia?.("(pointer: coarse)").matches;
    if (!isTouch) input.focus({ preventScroll: true });

    return () => {
      input.removeEventListener("beforeinput", onBeforeInput);
      input.removeEventListener("input", onInput);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return { char, caps: char === char.toUpperCase(), inputRef };
}
