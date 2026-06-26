"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Role } from "@/types/user";
import { sanctionApi } from "@/lib/api/sanction.api";
import { ApiClientError } from "@/lib/api/HttpClient";
import { ILoanApplication } from "@/types/loan";
import { LoanTable } from "@/components/dashboard/LoanTable";
import { Button, Input, Spinner, Alert } from "@/components/ui";

function SanctionRowActions({
  loan,
  onUpdated,
}: {
  loan: ILoanApplication;
  onUpdated: (loan: ILoanApplication) => void;
}) {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const approve = async () => {
    setIsBusy(true);
    setError(null);
    try {
      onUpdated(await sanctionApi.sanctionLoan(loan.id));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to sanction loan");
    } finally {
      setIsBusy(false);
    }
  };

  const reject = async () => {
    if (reason.trim().length < 5) {
      setError("Reason must be at least 5 characters");
      return;
    }
    setIsBusy(true);
    setError(null);
    try {
      onUpdated(await sanctionApi.rejectLoan(loan.id, reason));
      setShowReject(false);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to reject loan");
    } finally {
      setIsBusy(false);
    }
  };

  if (showReject) {
    return (
      <div className="flex min-w-[220px] flex-col gap-2">
        {error && <p className="text-caption text-danger-600">{error}</p>}
        <Input
          placeholder="Rejection reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="danger" onClick={reject} isLoading={isBusy}>
            Confirm Reject
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowReject(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-caption text-danger-600">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" variant="accent" onClick={approve} isLoading={isBusy}>
          Sanction
        </Button>
        <Button size="sm" variant="outline" onClick={() => setShowReject(true)}>
          Reject
        </Button>
      </div>
    </div>
  );
}

function SanctionContent() {
  const [loans, setLoans] = useState<ILoanApplication[] | null>(null);

  useEffect(() => {
    sanctionApi.getAppliedLoans().then((res) => setLoans(res.items));
  }, []);

  const handleUpdated = (updated: ILoanApplication) => {
    setLoans((prev) => (prev ?? []).filter((l) => l.id !== updated.id));
  };

  return (
    <DashboardShell title="Sanction — Applied Loans">
      <p className="mb-6 text-body text-slate-500">Review and approve or reject pending applications.</p>
      {loans === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <LoanTable
          loans={loans}
          emptyTitle="No loans awaiting sanction"
          emptyDescription="New applications will appear here as borrowers apply."
          renderActions={(loan) => <SanctionRowActions loan={loan} onUpdated={handleUpdated} />}
        />
      )}
    </DashboardShell>
  );
}

export default function SanctionPage() {
  return (
    <RoleGuard allow={[Role.SANCTION]}>
      <SanctionContent />
    </RoleGuard>
  );
}
