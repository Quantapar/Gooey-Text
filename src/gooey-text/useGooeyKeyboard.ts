import { useEffect, useState } from "react";

export interface GooeyKeyboardState {
  /** The current character, in the case typed (e.g. "a" or "A"). */
  char: string;
  /** True when the current character is a capital — driven by the keyboard. */
  caps: boolean;
}

/**
 * Tracks the last letter key pressed. The case comes straight from the keyboard
 * event, so Shift and CapsLock both produce capitals — the user controls caps
 * from their keyboard, nothing to click. `caps` simply reflects that case.
 * Ignores keys pressed with ⌘/Ctrl/Alt so browser shortcuts still work.
 */
export function useGooeyKeyboard(initial = "a"): GooeyKeyboardState {
  const [char, setChar] = useState(initial);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[a-zA-Z]$/.test(e.key)) setChar(e.key);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { char, caps: char === char.toUpperCase() };
}
