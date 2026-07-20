import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "red",
  color,
  className,
}: {
  children: React.ReactNode;
  variant?: "red" | "blue" | "teal";
  /** Optional explicit background color (hex). Overrides `variant`; text stays white. */
  color?: string;
  className?: string;
}) {
  const styles = {
    red: "bg-brand-red text-white",
    blue: "bg-brand-blue text-white",
    teal: "bg-brand-teal/20 text-brand-teal-bright border border-brand-teal/40",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
        color ? "text-white" : styles[variant],
        className
      )}
      style={color ? { backgroundColor: color } : undefined}
    >
      {children}
    </span>
  );
}
