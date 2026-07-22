/**
 * Partner/client card description. Historically this clamped the text with an
 * "ещё" expand toggle; the control is gone at every breakpoint now and the
 * full description always shows. Only the partners page uses this component.
 */
export function ExpandableText({ text, className }: { text?: string; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      <p className="text-sm leading-relaxed text-text-secondary">{text}</p>
    </div>
  );
}
