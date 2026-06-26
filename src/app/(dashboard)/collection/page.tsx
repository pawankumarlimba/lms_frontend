"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Role } from "@/types/user";
import { collectionApi } from "@/lib/api/collection.api";
import { ILoanApplication } from "@/types/loan";
import { LoanTable } from "@/components/dashboard/LoanTable";
import { Button, Spinner } from "@/components/ui";

function CollectionContent() {
  const [loans, setLoans] = useState<ILoanApplication[] | null>(null);

  useEffect(() => {
    collectionApi.getDisbursedLoans().then((res) => setLoans(res.items));
  }, []);

  return (
    <DashboardShell title="Collection — Disbursed Loans">
      <p className="mb-6 text-body text-slate-500">Record borrower repayments against disbursed loans.</p>
      {loans === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <LoanTable
          loans={loans}
          emptyTitle="No active loans"
          emptyDescription="Disbursed loans awaiting collection will appear here."
          renderActions={(loan) => (
            <Link href={`/collection/${loan.id}`}>
              <Button size="sm">Record Payment</Button>
            </Link>
          )}
        />
      )}
    </DashboardShell>
  );
}

export default function CollectionPage() {
  return (
    <RoleGuard allow={[Role.COLLECTION]}>
      <CollectionContent />
    </RoleGuard>
  );
}
