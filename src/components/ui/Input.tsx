import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="font-body text-label uppercase text-slate-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "h-11 rounded-md border bg-white px-3 font-body text-body text-ink-950 placeholder:text-slate-300",
            "transition-colors focus:border-navy-500",
            error ? "border-danger-600" : "border-border",
            className
          )}
          aria-invalid={Boolean(error)}
          {...rest}
        />
        {error ? (
          <p className="text-caption text-danger-600">{error}</p>
        ) : hint ? (
          <p className="text-caption text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
