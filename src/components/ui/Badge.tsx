import { HTMLAttributes } from "react";
import clsx from "clsx";
import { StatusTone } from "@/lib/constants/loanStatus";

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success-100 text-success-600",
  danger: "bg-danger-100 text-danger-600",
  warning: "bg-warning-100 text-warning-600",
  neutral: "bg-slate-200 text-slate-700",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
}

export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-caption font-medium",
        toneClasses[tone],
        className
      )}
      {...rest}
    />
  );
}
