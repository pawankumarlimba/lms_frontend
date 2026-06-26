"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { borrowerApi } from "@/lib/api/borrower.api";
import { ApiClientError } from "@/lib/api/HttpClient";
import { runClientBreMirror } from "@/lib/utils/bre-mirror";
import { EmploymentMode } from "@/types/loan";
import { Button, Input, Select, Card, Alert } from "@/components/ui";
import { StepIndicator } from "@/components/borrower/StepIndicator";
import { BreChecklist } from "@/components/borrower/BreChecklist";

const EMPLOYMENT_OPTIONS = [
  { value: EmploymentMode.SALARIED, label: "Salaried" },
  { value: EmploymentMode.SELF_EMPLOYED, label: "Self-Employed" },
  { value: EmploymentMode.UNEMPLOYED, label: "Unemployed" },
];

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [employmentMode, setEmploymentMode] = useState<EmploymentMode | "">("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breChecks = useMemo(
    () =>
      runClientBreMirror({
        dateOfBirth,
        monthlySalary: Number(monthlySalary) || 0,
        panNumber,
        employmentMode,
      }),
    [dateOfBirth, monthlySalary, panNumber, employmentMode]
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);
    setRejectionReasons([]);
    setIsSubmitting(true);
    try {
      await borrowerApi.submitPersonalDetails({
        fullName,
        panNumber: panNumber.toUpperCase(),
        dateOfBirth,
        monthlySalary: Number(monthlySalary),
        employmentMode: employmentMode as EmploymentMode,
      });
      router.push("/apply/loan-config");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
        const reasons = (err.fieldErrors as unknown as { failedReasons?: string[] })?.failedReasons;
        if (Array.isArray(reasons)) setRejectionReasons(reasons);
      } else {
        setServerError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-xl">
        <StepIndicator current={2} />
        <Card>
          <p className="mb-1 font-display text-display-md text-ink-950">Personal Details</p>
          <p className="mb-6 text-body text-slate-500">
            We run an instant eligibility check (BRE) before you can apply.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {serverError && (
              <Alert tone="danger" title={serverError}>
                {rejectionReasons.length > 0 && (
                  <ul className="mt-1 list-inside list-disc">
                    {rejectionReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                )}
              </Alert>
            )}

            <Input label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <Input
              label="PAN Number"
              required
              placeholder="ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              maxLength={10}
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <Input
              label="Monthly Salary (₹)"
              type="number"
              required
              min={0}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
            />
            <Select
              label="Employment Mode"
              required
              placeholder="Select employment mode"
              options={EMPLOYMENT_OPTIONS}
              value={employmentMode}
              onChange={(e) => setEmploymentMode(e.target.value as EmploymentMode)}
            />

            <div className="rounded-md border border-border bg-paper-muted p-4">
              <p className="mb-2 text-label uppercase text-slate-500">Eligibility Preview</p>
              <BreChecklist checks={breChecks} />
            </div>

            <Button type="submit" isLoading={isSubmitting}>
              Continue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
