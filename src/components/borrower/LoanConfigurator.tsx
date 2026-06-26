"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { SimpleInterestCalculator } from "@/lib/utils/interest";
import { formatINR } from "@/lib/utils/currency";

const MIN_PRINCIPAL = 50_000;
const MAX_PRINCIPAL = 500_000;
const PRINCIPAL_STEP = 5_000;

const MIN_TENURE = 30;
const MAX_TENURE = 365;

const calculator = new SimpleInterestCalculator(12);

interface LoanConfiguratorProps {
  onChange: (values: { principal: number; tenureDays: number }) => void;
}

export function LoanConfigurator({ onChange }: LoanConfiguratorProps) {
  const [principal, setPrincipal] = useState(100_000);
  const [tenureDays, setTenureDays] = useState(90);

  const breakdown = useMemo(() => calculator.calculate(principal, tenureDays), [principal, tenureDays]);

  const handlePrincipalChange = (value: number) => {
    setPrincipal(value);
    onChange({ principal: value, tenureDays });
  };

  const handleTenureChange = (value: number) => {
    setTenureDays(value);
    onChange({ principal, tenureDays: value });
  };

  return (
    <div className="flex flex-col gap-8">
      <Slider
        label="Loan Amount"
        valueLabel={formatINR(principal)}
        min={MIN_PRINCIPAL}
        max={MAX_PRINCIPAL}
        step={PRINCIPAL_STEP}
        value={principal}
        onChange={(e) => handlePrincipalChange(Number(e.target.value))}
        helperMin={formatINR(MIN_PRINCIPAL)}
        helperMax={formatINR(MAX_PRINCIPAL)}
      />
      <Slider
        label="Tenure"
        valueLabel={`${tenureDays} days`}
        min={MIN_TENURE}
        max={MAX_TENURE}
        step={1}
        value={tenureDays}
        onChange={(e) => handleTenureChange(Number(e.target.value))}
        helperMin={`${MIN_TENURE} days`}
        helperMax={`${MAX_TENURE} days`}
      />

      <div className="rounded-lg border border-border bg-paper-muted p-5">
        <p className="mb-3 text-label uppercase text-slate-500">Live Repayment Summary</p>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-caption text-slate-500">Principal</dt>
            <dd className="ledger-figure text-body-lg text-ink-950">{formatINR(breakdown.principal)}</dd>
          </div>
          <div>
            <dt className="text-caption text-slate-500">Interest Rate</dt>
            <dd className="ledger-figure text-body-lg text-ink-950">12% p.a.</dd>
          </div>
          <div>
            <dt className="text-caption text-slate-500">Simple Interest</dt>
            <dd className="ledger-figure text-body-lg text-ink-950">{formatINR(breakdown.interest)}</dd>
          </div>
          <div>
            <dt className="text-caption text-slate-500">Total Repayment</dt>
            <dd className="ledger-figure text-body-lg text-brass-600">{formatINR(breakdown.totalRepayment)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
