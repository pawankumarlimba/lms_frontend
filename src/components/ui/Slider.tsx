import { InputHTMLAttributes } from "react";
import clsx from "clsx";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  valueLabel: string;
  helperMin?: string;
  helperMax?: string;
}

export function Slider({ label, valueLabel, helperMin, helperMax, className, ...rest }: SliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-body text-label uppercase text-slate-500">{label}</span>
        <span className="ledger-figure text-display-md text-navy-700">{valueLabel}</span>
      </div>
      <input
        type="range"
        className={clsx(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brass-500",
          className
        )}
        {...rest}
      />
      {(helperMin || helperMax) && (
        <div className="flex justify-between text-caption text-slate-500">
          <span>{helperMin}</span>
          <span>{helperMax}</span>
        </div>
      )}
    </div>
  );
}
