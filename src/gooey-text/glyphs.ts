// A single-line ("skeleton") SVG font: every glyph is ONE open stroke, which is
// exactly what the gooey effect wants — the circles ride along that stroke.
// Bun inlines the file contents as a string for us.
import defaultFont from "./letterfont.svg" with { type: "text" };

// Parse a font string once into a `char -> raw stroke path` map (cached).
const fontCache = new Map<string, Map<string, string>>();
function parseFont(svg: string): Map<string, string> {
  let glyphs = fontCache.get(svg);
  if (glyphs) return glyphs;
  glyphs = new Map();
  for (const m of svg.matchAll(/<glyph[^>]*unicode="(.)"[^>]*\sd="([^"]*)"/g)) {
    glyphs.set(m[1], m[2]);
  }
  fontCache.set(svg, glyphs);
  return glyphs;
}

/**
 * Turn a character into an SVG path "d" string — flipped (fonts are y-up),
 * scaled and centered to fit nicely inside the 0 0 256 256 viewBox.
 * Pass your own single-line SVG font text via `fontSvg` to swap typefaces.
 */
export function letterToPath(char: string, fontSvg: string = defaultFont): string {
  const raw = parseFont(fontSvg).get(char);
  if (!raw) return "";

  // This font only uses absolute M / L / C — all of them coordinate pairs.
  const tokens = raw.match(/[MLC]|-?[\d.]+/g) ?? [];
  const nums = tokens.filter((t) => !/[MLC]/.test(t)).map(Number);

  // Bounding box over every point (font space, y pointing UP).
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    minX = Math.min(minX, nums[i]);
    maxX = Math.max(maxX, nums[i]);
    minY = Math.min(minY, nums[i + 1]);
    maxY = Math.max(maxY, nums[i + 1]);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const scale = 190 / Math.max(maxX - minX, maxY - minY);
  const mapX = (x: number) => (x - cx) * scale + 128;
  const mapY = (y: number) => (cy - y) * scale + 128; // flip vertical

  // Rebuild the path with transformed coordinates.
  let out = "";
  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i++];
    out += cmd;
    const pairs = cmd === "C" ? 3 : 1; // C = 3 points, M/L = 1 point
    for (let p = 0; p < pairs; p++) {
      const x = Number(tokens[i++]);
      const y = Number(tokens[i++]);
      out += ` ${mapX(x).toFixed(2)} ${mapY(y).toFixed(2)}`;
    }
    out += " ";
  }
  return out.trim();
}
