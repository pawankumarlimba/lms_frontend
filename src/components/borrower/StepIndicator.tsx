import clsx from "clsx";

const STEPS = ["Sign Up", "Personal Details", "Upload & Apply"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;
        return (
          <li key={step} className="flex flex-1 items-center gap-2">
            <span
              className={clsx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-caption",
                isActive && "bg-navy-700 text-paper",
                isDone && "bg-brass-500 text-ink-950",
                !isActive && !isDone && "bg-slate-200 text-slate-500"
              )}
            >
              {isDone ? "✓" : stepNumber}
            </span>
            <span
              className={clsx(
                "hidden text-caption sm:inline",
                isActive ? "text-ink-950 font-medium" : "text-slate-500"
              )}
            >
              {step}
            </span>
            {stepNumber !== STEPS.length && <span className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
