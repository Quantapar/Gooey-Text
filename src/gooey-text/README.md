# gooey-text

A single character rendered as a **gooey blob** that morphs whenever the
character changes. Circles travel along the glyph's stroke and an SVG filter
(`feGaussianBlur` + `feColorMatrix`) melts them into one liquid shape.

Inspired by Oli Larose's [Text Gooey Morph](https://blog.olivierlarose.com)
tutorial — same technique, generalized to the whole alphabet.

## Usage

```tsx
import { GooeyText, useGooeyKeyboard } from "./gooey-text";

export function Demo() {
  const { char, caps } = useGooeyKeyboard(); // tracks the last letter key pressed
  return <GooeyText char={char} radius={caps ? 19 : 17} />;
}
```

`useGooeyKeyboard` follows the real key event, so **Shift / CapsLock give
capitals** automatically — the user controls case from their keyboard. It
returns `{ char, caps }`, where `caps` is `true` when `char` is a capital. Or
drive `char` yourself from any source.

## `<GooeyText>` props

| prop        | default     | what it does                                          |
| ----------- | ----------- | ----------------------------------------------------- |
| `char`      | —           | the single character to show (`"a"` vs `"A"`)         |
| `size`      | `420`       | rendered width/height in px                           |
| `color`     | `"#ffffff"` | blob color                                            |
| `circles`   | `64`        | how many blobs trace the letter                       |
| `radius`    | `17`        | blob radius before the blur fuses them                |
| `blur`      | `14`        | `feGaussianBlur` stdDeviation — bigger = meltier / **more cohesive** |
| `intensity` | `100`       | alpha-matrix multiplier — bigger = **crisper edges**  |
| `threshold` | `0.56`      | fill cutoff 0..1 — bigger = thinner strokes / **bigger holes** |
| `duration`  | `0.7`       | per-blob travel time (s)                              |
| `stagger`   | `0.01`      | delay added per blob — the morph "wave" (s)           |
| `overrides` | —           | `{ a: "M ..." }` per-letter hand-tweaked paths        |
| `font`      | bundled     | custom single-line SVG font text                      |

## Per-letter tweaks (later)

Glyphs come from a single-line SVG font (`letterfont.svg`). To hand-tune a
specific letter, pass an `overrides` map with your own path `d` (in the
`0 0 256 256` box):

```tsx
<GooeyText char={char} overrides={{ a: "M 168 96 L 168 196 ..." }} />
```
