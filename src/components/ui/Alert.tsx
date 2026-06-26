import { ReactNode } from "react";
import clsx from "clsx";
import { StatusTone } from "@/lib/constants/loanStatus";

const toneClasses: Record<StatusTone, string> = {
  success: "border-success-600/30 bg-success-100 text-success-600",
  danger: "border-danger-600/30 bg-danger-100 text-danger-600",
  warning: "border-warning-600/30 bg-warning-100 text-warning-600",
  neutral: "border-border bg-paper-muted text-ink-950",
};

interface AlertProps {
  tone?: StatusTone;
  title?: string;
  children?: ReactNode;
  className?: string;
}

export function Alert({ tone = "neutral", title, children, className }: AlertProps) {
  return (
    <div className={clsx("rounded-md border px-4 py-3 text-body", toneClasses[tone], className)}>
      {title && <p className="font-medium">{title}</p>}
      {children}
    </div>
  );
}
