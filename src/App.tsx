import { GooeyText, useGooeyKeyboard } from "./gooey-text";
import "./index.css";

export function App() {
  const { char, caps } = useGooeyKeyboard();

  return (
    <>
      <main className="flex flex-col items-center gap-6 p-8 text-center">
        <header className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Gooey Text</h1>
          <p className="text-sm text-white/40">Type any alphabet</p>
        </header>

        {/* caps letters get slightly bigger, sharper blobs */}
        <GooeyText
          char={char}
          radius={caps ? 19 : 17}
          intensity={caps ? 150 : 100}
        />

        <p className="mt-6 text-sm text-white/35">
          Showing <span className="text-white/75">{char}</span>
        </p>
      </main>

      <footer className="fixed bottom-4 right-5 flex flex-col items-end gap-1 text-xs text-white/30">
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
