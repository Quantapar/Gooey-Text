import { GooeyText, useGooeyKeyboard } from "./gooey-text";
import "./index.css";

export function App() {
  const { char, caps, prev, next, setCaps } = useGooeyKeyboard();

  return (
    <>
      <main className="flex w-full max-w-full flex-col items-center gap-5 p-6 text-center sm:gap-6 sm:p-8">
        <header className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Gooey Text</h1>
          <p className="text-sm text-white/40">
            <span className="pointer-coarse:hidden">Type any alphabet</span>
            <span className="hidden pointer-coarse:inline">Browse the alphabet</span>
          </p>
        </header>

        {/* Web: just type. Mobile: arrows flank the letter to step the alphabet. */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous letter"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition active:scale-90 active:bg-white/10 pointer-coarse:flex"
          >
            <Chevron dir="left" />
          </button>

          {/* caps letters get slightly bigger, sharper blobs */}
          {/* size scales with the viewport; a touch narrower on mobile to leave room for the arrows */}
          <GooeyText
            char={char}
            radius={caps ? 19 : 17}
            intensity={caps ? 150 : 100}
            className="h-auto w-[min(78vw,420px)] pointer-coarse:w-[min(52vw,420px)]"
          />

          <button
            type="button"
            onClick={next}
            aria-label="Next letter"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition active:scale-90 active:bg-white/10 pointer-coarse:flex"
          >
            <Chevron dir="right" />
          </button>
        </div>

        <p className="text-sm text-white/35">
          Showing <span className="text-white/75">{char}</span>
        </p>

        {/* Caps toggle — mobile only (web uses Shift / CapsLock). */}
        <button
          type="button"
          onClick={() => setCaps(!caps)}
          aria-pressed={caps}
          className={
            "hidden items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition pointer-coarse:inline-flex " +
            (caps
              ? "border-white bg-white text-black"
              : "border-white/15 text-white/55 active:bg-white/10")
          }
        >
          Caps {caps ? "on" : "off"}
        </button>
      </main>

      <footer className="fixed bottom-4 right-4 flex max-w-[70vw] flex-col items-end gap-1 text-right text-xs text-white/30 sm:right-5">
        <a
          href="https://x.com/quantapar"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-white/70"
        >
          built by @quantapar
        </a>
        <a
          href="https://blog.olivierlarose.com/tutorials/text-gooey"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-white/70"
        >
          based on Olivier Larose's tutorial ↗
        </a>
      </footer>
    </>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default App;
