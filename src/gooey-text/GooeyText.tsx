import { useEffect, useId, useRef, useState } from "react";
import { animate } from "framer-motion";
import { letterToPath } from "./glyphs";

export interface GooeyTextProps {
  /** The single character to display (case-sensitive: "a" vs "A"). */
  char: string;
  /** Rendered width/height in px. Default 420. */
  size?: number;
  /** Blob color. Default "#ffffff". */
  color?: string;
  /** How many blobs trace the letter. Default 64. */
  circles?: number;
  /** Radius of each blob before the blur fuses them. Default 17. */
  radius?: number;
  /** feGaussianBlur stdDeviation — bigger = meltier / more cohesive. Default 14. */
  blur?: number;
  /** Alpha-matrix multiplier — bigger = crisper edges. Default 100. */
  intensity?: number;
  /** Fill threshold 0..1 — bigger = thinner strokes / bigger holes. Default 0.56. */
  threshold?: number;
  /** Per-blob travel time in seconds. Default 0.7. */
  duration?: number;
  /** Delay added per blob, in seconds (the morph "wave"). Default 0.01. */
  stagger?: number;
  /** Per-letter path overrides, e.g. { a: "M ..." }, for hand-tweaked glyphs. */
  overrides?: Record<string, string>;
  /** Custom single-line SVG font text (defaults to the bundled one). */
  font?: string;
  className?: string;
}

/**
 * A single character rendered as a gooey blob that morphs whenever `char`
 * changes — circles travel along the glyph's stroke and an SVG filter melts
 * them together (feGaussianBlur + feColorMatrix).
 */
export function GooeyText({
  char,
  size = 420,
  color = "#ffffff",
  circles = 64,
  radius = 17,
  blur = 14,
  intensity = 100,
  threshold = 0.56,
  duration = 0.7,
  stagger = 0.01,
  overrides,
  font,
  className,
}: GooeyTextProps) {
  // unique filter id so multiple instances can live on one page
  const filterId = "goo-" + useId().replace(/[:]/g, "");
  const pathRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<SVGCircleElement[]>([]);
  // React only sets the circles' radius once; after that the morph animates it,
  // so a changing `radius` (e.g. caps ↔ lowercase) eases instead of snapping.
  const firstRadius = useRef(radius);
  const prevRadius = useRef(radius);
  const [pathD, setPathD] = useState("");

  // Resolve the current glyph (with optional hand-tweaked override).
  useEffect(() => {
    setPathD(overrides?.[char] ?? letterToPath(char, font));
  }, [char, overrides, font]);

  // Once the path is in the DOM, spread the circles along it — the gooey morph.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !pathD) return;

    const length = path.getTotalLength();
    const step = length / circles;

    // Ease the stroke radius directionally so caps's fatter strokes never flash
    // a hole during a morph: grow FAST (fill the counter as the cap forms) but
    // shrink SLOW (stay solid until the shape is no longer the cap).
    const rEase = radius >= prevRadius.current ? "circOut" : "circIn";
    prevRadius.current = radius;

    circleRefs.current.forEach((circle, i) => {
      if (!circle) return;
      const { x, y } = path.getPointAtLength(i * step);
      animate(circle, { cx: x, cy: y }, { delay: i * stagger, ease: "easeOut", duration });
      animate(circle, { r: radius }, { delay: i * stagger, ease: rEase, duration });
    });
    // radius is read fresh on each pathD change (they change together)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathD, circles, stagger, duration]);

  // alpha row: A' = alpha * intensity - intensity * threshold  (clamped 0..1)
  const matrix = `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${intensity} ${-(
    intensity * threshold
  )}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      className={className}
      role="img"
      aria-label={char}
    >
      <defs>
        {/* Blur the circles so they overlap, then crank the alpha contrast back
            up so the soft edges snap into one solid gooey blob. */}
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix in="blur" mode="matrix" values={matrix} result="goo" />
        </filter>
      </defs>

      {/* Invisible guide path — never drawn, only measured for points. */}
      <path ref={pathRef} d={pathD} fill="none" stroke="none" />

      {/* The circles that the gooey filter is applied to. */}
      <g filter={`url(#${filterId})`} fill={color}>
        {Array.from({ length: circles }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => {
              if (el) circleRefs.current[i] = el;
            }}
            cx="128"
            cy="128"
            r={firstRadius.current}
          />
        ))}
      </g>
    </svg>
  );
}
