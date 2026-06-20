import { GooeyText, useGooeyKeyboard } from "./gooey-text";
import "./index.css";

export function App() {
  const { char, caps } = useGooeyKeyboard();

  return (
    <>
      <main className="flex w-full max-w-full flex-col items-center gap-5 p-6 text-center sm:gap-6 sm:p-8">
        <header className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Gooey Text</h1>
          <p className="text-sm text-white/40">Type any alphabet</p>
        </header>

        {/* caps letters get slightly bigger, sharper blobs */}
        {/* size scales with the viewport so it never overflows on phones */}
        <GooeyText
          char={char}
          radius={caps ? 19 : 17}
          intensity={caps ? 150 : 100}
          className="h-auto w-[min(78vw,420px)]"
        />

        <p className="mt-6 text-sm text-white/35">
          Showing <span className="text-white/75">{char}</span>
        </p>
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

export default App;
