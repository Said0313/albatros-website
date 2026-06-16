import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "red",
  className,
}: {
  children: React.ReactNode;
  variant?: "red" | "blue" | "teal";
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
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
