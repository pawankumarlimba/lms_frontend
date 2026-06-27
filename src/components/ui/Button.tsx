import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "accent" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-navy-700 text-paper hover:bg-navy-600 active:bg-ink-900",
  accent: "bg-brass-500 text-ink-950 hover:bg-brass-600",
  ghost: "bg-transparent text-navy-700 hover:bg-navy-700/[0.06]",
  danger: "bg-danger-600 text-paper hover:opacity-90",
  outline: "border border-border bg-transparent text-ink-950 hover:bg-paper-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-3 text-caption",
  md: "h-10 px-4 text-body",
  lg: "h-12 px-6 text-body-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", isLoading, className, children, disabled, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-md font-body font-medium transition-colors duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...rest}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
