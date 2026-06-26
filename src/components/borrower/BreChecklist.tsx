import clsx from "clsx";
import { IClientBreCheck } from "@/lib/utils/bre-mirror";

export function BreChecklist({ checks }: { checks: IClientBreCheck[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {checks.map((check) => (
        <li key={check.rule} className="flex items-center gap-2 text-body">
          <span
            className={clsx(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-caption",
              check.passed ? "bg-success-100 text-success-600" : "bg-danger-100 text-danger-600"
            )}
          >
            {check.passed ? "✓" : "✕"}
          </span>
          <span className={check.passed ? "text-ink-950" : "text-slate-500"}>{check.reason}</span>
        </li>
      ))}
    </ul>
  );
}
