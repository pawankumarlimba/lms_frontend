"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { borrowerApi } from "@/lib/api/borrower.api";
import { ApiClientError } from "@/lib/api/HttpClient";
import { Button, Card, Alert } from "@/components/ui";
import { StepIndicator } from "@/components/borrower/StepIndicator";
import { FileDropzone } from "@/components/borrower/FileDropzone";
import { LoanConfigurator } from "@/components/borrower/LoanConfigurator";

export default function LoanConfigPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState({ principal: 100_000, tenureDays: 90 });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Please upload your salary slip before applying");
      return;
    }

    setIsSubmitting(true);
    try {
      const loan = await borrowerApi.applyForLoan({
        principal: config.principal,
        tenureDays: config.tenureDays,
        salarySlip: file,
      });
      router.push(`/applications/${loan.id}`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-xl">
        <StepIndicator current={3} />
        <Card>
          <p className="mb-1 font-display text-display-md text-ink-950">Upload Salary Slip &amp; Configure Loan</p>
          <p className="mb-6 text-body text-slate-500">
            Interest is fixed at 12% p.a., calculated as simple interest on your chosen tenure.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {error && <Alert tone="danger">{error}</Alert>}
            <FileDropzone onFileSelected={setFile} />
            <LoanConfigurator onChange={setConfig} />
            <Button type="submit" variant="accent" size="lg" isLoading={isSubmitting}>
              Apply for Loan
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
