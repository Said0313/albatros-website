import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red disabled:opacity-50",
  {
    variants: {
      variant: {
        red: "btn-red",
        outline:
          "border border-bg-border bg-bg-card text-brand-blue-deep shadow-[0_1px_2px_rgba(16,40,90,0.04)] hover:border-brand-blue-light hover:bg-bg-elevated",
        ghost: "text-text-secondary hover:text-text-primary",
        white: "border border-bg-border bg-bg-card text-brand-blue-deep hover:bg-bg-elevated",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-7 py-3.5 text-[15px]",
      },
    },
    defaultVariants: { variant: "red", size: "md" },
  }
);

type Common = VariantProps<typeof buttonVariants> & { className?: string; children: React.ReactNode };

export function Button({
  variant,
  size,
  className,
  href,
  ...props
}: Common & ({ href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>)) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {props.children}
    </button>
  );
}

export { buttonVariants };
