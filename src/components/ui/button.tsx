import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";

type ButtonVariant = "primary" | "ai" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Material Symbols icon name, prefixed before the label. AI variant defaults to "auto_awesome". */
  icon?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover",
  ai: "bg-ai text-on-ai hover:bg-ai-hover",
  secondary:
    "bg-surface text-foreground border border-surface-border hover:bg-surface-hover",
  ghost: "bg-transparent text-foreground hover:bg-surface-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-body-md gap-1.5",
  md: "h-10 px-4 text-body-md gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", icon, children, ...props }, ref) => {
    const resolvedIcon = icon ?? (variant === "ai" ? "auto_awesome" : undefined);
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {resolvedIcon && <Icon name={resolvedIcon} className="text-[20px]" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
