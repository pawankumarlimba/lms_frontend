import clsx from "clsx";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-navy-700",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-paper-muted px-6 py-14 text-center">
      {icon}
      <p className="font-display text-heading text-ink-950">{title}</p>
      {description && <p className="max-w-sm text-body text-slate-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
