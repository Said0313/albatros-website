import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders a product's free-text "detailed description" (which already carries
 * its own structure) as differentiated blocks instead of a uniform wall.
 *
 * The source text uses three shapes, detected CONSERVATIVELY - anything not
 * clearly a header or a bullet renders as plain body, since a wrongly promoted
 * header looks worse than a plain line:
 *  - a line starting with "- " is a bullet;
 *  - a short line is a section header only when it either ends with ":" or is
 *    a short label (<= 8 words) immediately followed by a bullet, e.g.
 *    "Основные характеристики", "Габариты, вес и пр.", "Преимущества ...:";
 *  - everything else is body text.
 *
 * Inline **bold** and *italic* markdown is supported so emphasis can be added
 * per product later without a code change.
 */
type Block = { type: "header" | "bullet" | "body"; text: string };

const INLINE = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;

function renderInline(text: string): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text))) {
    if (m.index > last) out.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1] != null) out.push(<strong key={key++} className="font-semibold text-text-primary">{m[1]}</strong>);
    else out.push(<em key={key++}>{m[2]}</em>);
    last = INLINE.lastIndex;
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return out;
}

function parse(text: string): Block[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.map((line, i) => {
    if (line.startsWith("- ")) return { type: "bullet", text: line.slice(2).trim() };
    const next = lines[i + 1] ?? "";
    const isHeader =
      (line.endsWith(":") && line.length <= 80) ||
      (line.length <= 60 && next.startsWith("- ") && line.split(/\s+/).length <= 8);
    return { type: isHeader ? "header" : "body", text: line };
  });
}

// Varied spacing: tight between bullets in a group, larger before a new header,
// and a slightly tighter gap between a header and its first bullet than the
// gap between groups.
function topMargin(prev: Block["type"] | null, type: Block["type"]): string {
  if (prev == null) return "";
  if (type === "header") return "mt-8";
  if (type === "bullet") return prev === "header" ? "mt-2" : prev === "bullet" ? "mt-1.5" : "mt-3";
  return prev === "header" ? "mt-2" : "mt-4";
}

export function DetailedDescription({ text }: { text: string }) {
  const blocks = parse(text);
  return (
    <div className="max-w-3xl text-[15px] leading-[1.8] text-text-secondary">
      {blocks.map((b, i) => {
        const mt = topMargin(i > 0 ? blocks[i - 1].type : null, b.type);
        if (b.type === "header") {
          return (
            <h3 key={i} className={cn(mt, "font-display text-base font-bold text-text-primary md:text-[17px]")}>
              {renderInline(b.text)}
            </h3>
          );
        }
        if (b.type === "bullet") {
          return (
            <div key={i} className={cn(mt, "flex gap-2.5")}>
              <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red/70" />
              <span>{renderInline(b.text)}</span>
            </div>
          );
        }
        return (
          <p key={i} className={mt}>
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}
