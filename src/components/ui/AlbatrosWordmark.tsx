import Image from "next/image";

/**
 * Albatros wordmark set in the SITE typography (Inter) with the REAL DNA helix
 * mark (`/images/albatros-helix-mark.png`, transparent) — fixes the raster
 * logo's font clash next to the heading text while using the authentic mark glyph.
 */
export function AlbatrosWordmark({
  markSize = 66,
  textSize = 34,
  className,
}: {
  markSize?: number;
  textSize?: number;
  className?: string;
}) {
  // Sizes scale down on small screens (clamp max = the requested size, so desktop
  // is pixel-identical) — fixes "ALBATROS" clipping out of narrow mobile columns.
  const markH = `clamp(${(markSize * 0.72).toFixed(1)}px, 10.5vw, ${markSize}px)`;
  const mainSize = `clamp(${(textSize * 0.62).toFixed(1)}px, 7.5vw, ${textSize}px)`;
  const subSize = `clamp(${(textSize * 0.62 * 0.26).toFixed(2)}px, 1.95vw, ${(textSize * 0.26).toFixed(2)}px)`;
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: textSize * 0.42, maxWidth: "100%" }}
    >
      <Image
        src="/images/albatros-helix-mark.png"
        alt="Albatros Health Care"
        width={Math.round(markSize * 2.29)}
        height={markSize}
        style={{ height: markH, width: "auto", display: "block", flexShrink: 0 }}
        priority
      />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 800,
            fontSize: mainSize,
            letterSpacing: "0.01em",
            color: "#0C1B3A",
          }}
        >
          ALBATROS
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono), var(--font-inter), monospace",
            fontSize: subSize,
            letterSpacing: "0.42em",
            color: "#5E6E8F",
            marginTop: textSize * 0.14,
          }}
        >
          HEALTH&nbsp;CARE
        </span>
      </div>
    </div>
  );
}
