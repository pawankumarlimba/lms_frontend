"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Role } from "@/types/user";
import { disbursementApi } from "@/lib/api/disbursement.api";
import { ApiClientError } from "@/lib/api/HttpClient";
import { ILoanApplication } from "@/types/loan";
import { LoanTable } from "@/components/dashboard/LoanTable";
import { Button, Spinner } from "@/components/ui";

function DisburseAction({ loan, onUpdated }: { loan: ILoanApplication; onUpdated: (l: ILoanApplication) => void }) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disburse = async () => {
    setIsBusy(true);
    setError(null);
    try {
      onUpdated(await disbursementApi.disburseLoan(loan.id));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to disburse loan");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {error && <p className="text-caption text-danger-600">{error}</p>}
      <Button size="sm" variant="accent" onClick={disburse} isLoading={isBusy}>
        Disburse
      </Button>
    </div>
  );
}

function DisbursementContent() {
  const [loans, setLoans] = useState<ILoanApplication[] | null>(null);

  useEffect(() => {
    disbursementApi.getSanctionedLoans().then((res) => setLoans(res.items));
  }, []);

  const handleUpdated = (updated: ILoanApplication) => {
    setLoans((prev) => (prev ?? []).filter((l) => l.id !== updated.id));
  };

  return (
    <DashboardShell title="Disbursement — Sanctioned Loans">
      <p className="mb-6 text-body text-slate-500">Release funds for sanctioned loans.</p>
      {loans === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <LoanTable
          loans={loans}
          emptyTitle="No loans awaiting disbursement"
          renderActions={(loan) => <DisburseAction loan={loan} onUpdated={handleUpdated} />}
        />
      )}
    </DashboardShell>
  );
}

export default function DisbursementPage() {
  return (
    <RoleGuard allow={[Role.DISBURSEMENT]}>
      <DisbursementContent />
    </RoleGuard>
  );
}
