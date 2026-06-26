"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { borrowerApi } from "@/lib/api/borrower.api";
import { ILoanApplication } from "@/types/loan";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, Spinner, Alert } from "@/components/ui";
import { formatINR } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const [loan, setLoan] = useState<ILoanApplication | null>(null);

  useEffect(() => {
    borrowerApi.getApplicationById(params.id).then(setLoan);
  }, [params.id]);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar title="Application Detail" />
      <div className="mx-auto max-w-2xl px-6 py-8">
        {!loan ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <Card className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-caption text-slate-500">Application #{loan.id.slice(-8)}</p>
              <StatusBadge status={loan.status} />
            </div>

            {loan.status === "REJECTED" && loan.rejectionReason && (
              <Alert tone="danger" title="Rejected">
                {loan.rejectionReason}
              </Alert>
            )}

            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-caption text-slate-500">Principal</dt>
                <dd className="ledger-figure text-body-lg text-ink-950">{formatINR(loan.principal)}</dd>
              </div>
              <div>
                <dt className="text-caption text-slate-500">Tenure</dt>
                <dd className="ledger-figure text-body-lg text-ink-950">{loan.tenureDays} days</dd>
              </div>
              <div>
                <dt className="text-caption text-slate-500">Interest Rate</dt>
                <dd className="ledger-figure text-body-lg text-ink-950">{loan.interestRate}% p.a.</dd>
              </div>
              <div>
                <dt className="text-caption text-slate-500">Simple Interest</dt>
                <dd className="ledger-figure text-body-lg text-ink-950">{formatINR(loan.simpleInterest)}</dd>
              </div>
              <div>
                <dt className="text-caption text-slate-500">Total Repayment</dt>
                <dd className="ledger-figure text-body-lg text-brass-600">{formatINR(loan.totalRepayment)}</dd>
              </div>
              <div>
                <dt className="text-caption text-slate-500">Outstanding</dt>
                <dd className="ledger-figure text-body-lg text-ink-950">{formatINR(loan.outstandingAmount)}</dd>
              </div>
            </dl>

            <div className="border-t border-border pt-4 text-caption text-slate-500">
              Applied on {formatDate(loan.createdAt)}
              {loan.disbursedAt && <> &middot; Disbursed on {formatDate(loan.disbursedAt)}</>}
              {loan.closedAt && <> &middot; Closed on {formatDate(loan.closedAt)}</>}
            </div>

            <a
              href={loan.salarySlip.url}
              target="_blank"
              rel="noreferrer"
              className="text-body text-navy-700 underline"
            >
              View uploaded salary slip
            </a>
          </Card>
        )}
      </div>
    </div>
  );
}
