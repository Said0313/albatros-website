import logoSizes from "@/data/logoSizes.json";

/**
 * Chip sizing for the logo marquees.
 *
 * A logo strip works by fixing the HEIGHT and letting the width flow from each
 * logo's aspect ratio. Before this, `.logo-chip` carried a 150px min-width, so
 * every round mark sat in a box far wider than itself: all 24 of them rendered
 * at 32 to 64px wide inside a 150px chip, about 50px of dead space each, while
 * a wide wordmark filled the same box edge to edge and read several times
 * larger. Chip width now follows the logo.
 *
 * Two adjustments sit on top of the plain "same height for everyone" rule,
 * because equal height does not mean equal presence:
 *
 * - Round and near-square marks read optically smaller than wide ones, so they
 *   get a taller allowance (62px against the 48px baseline).
 * - Very wide wordmarks are capped on width so a single mark cannot run away
 *   with the line. MEDIK-AS at 9.3:1 was 446px wide against a 48px round mark.
 *   When the cap bites, the height is derived back from it so the aspect ratio
 *   is never distorted.
 *
 * The returned width and height are applied to the image explicitly, which also
 * preserves the earlier no-reflow guarantee: the box is fully determined before
 * the file loads, so the track width is final at first paint and the marquee's
 * translateX(-50%) cannot drift.
 */
const SIZES: Record<string, number[]> = logoSizes;

/** Baseline chip height. Wide wordmarks sit at this; rounder marks go above. */
const BASE_H = 48;

/** Height allowance by aspect ratio. Rounder marks need more to read as equal. */
function heightFor(ar: number): number {
  if (ar < 1.35) return 62; // round and near-square
  if (ar < 2.2) return 56;
  if (ar < 4) return BASE_H;
  if (ar < 6) return 44;
  return 40; // ultra wide
}

/** Width ceiling, so one very wide mark cannot dominate the strip. */
function maxWidthFor(ar: number): number {
  if (ar >= 6) return 280;
  if (ar >= 4) return 250;
  return Infinity;
}

export interface ChipSize {
  /** Rendered CSS width in px. */
  width: number;
  /** Rendered CSS height in px, derived from the cap when the cap applies. */
  height: number;
  /** True intrinsic pixel size, for the width/height attributes. */
  intrinsic: [number, number];
}

export function chipSize(logo: string): ChipSize {
  const s = SIZES[logo];
  const intrinsic: [number, number] = s && s.length === 2 ? [s[0], s[1]] : [160, 48];
  const ar = intrinsic[0] / intrinsic[1];
  let height = heightFor(ar);
  let width = height * ar;
  const max = maxWidthFor(ar);
  if (width > max) {
    width = max;
    height = width / ar; // keep the aspect ratio exact
  }
  return { width: Math.round(width), height: Math.round(height), intrinsic };
}

/** True for round and near-square marks, the ones that read optically smaller. */
export function isRoundish(logo: string): boolean {
  const { intrinsic } = chipSize(logo);
  return intrinsic[0] / intrinsic[1] < 1.35;
}
