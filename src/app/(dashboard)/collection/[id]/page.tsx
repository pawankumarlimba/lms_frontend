"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Role } from "@/types/user";
import { collectionApi } from "@/lib/api/collection.api";
import { ILoanApplication, IPayment } from "@/types/loan";
import { Card, Spinner } from "@/components/ui";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { RecordPaymentForm } from "@/components/dashboard/RecordPaymentForm";
import { formatINR } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

function CollectionDetailContent() {
  const params = useParams<{ id: string }>();
  const [loan, setLoan] = useState<ILoanApplication | null>(null);
  const [payments, setPayments] = useState<IPayment[]>([]);

  const load = async () => {
    const [loanDetail, history] = await Promise.all([
      collectionApi.getLoanById(params.id),
      collectionApi.getPaymentsForLoan(params.id),
    ]);
    setLoan(loanDetail);
    setPayments(history);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <DashboardShell title="Record Payment">
      {!loan ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-caption text-slate-500">#{loan.id.slice(-8)}</p>
              <StatusBadge status={loan.status} />
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-caption text-slate-500">Total Repayment</dt>
                <dd className="ledger-figure text-body-lg text-ink-950">{formatINR(loan.totalRepayment)}</dd>
              </div>
              <div>
                <dt className="text-caption text-slate-500">Total Paid</dt>
                <dd className="ledger-figure text-body-lg text-success-600">{formatINR(loan.totalPaid)}</dd>
              </div>
              <div>
                <dt className="text-caption text-slate-500">Outstanding</dt>
                <dd className="ledger-figure text-body-lg text-brass-600">{formatINR(loan.outstandingAmount)}</dd>
              </div>
            </dl>

            <div className="border-t border-border pt-4">
              <p className="mb-2 text-label uppercase text-slate-500">Payment History</p>
              {payments.length === 0 ? (
                <p className="text-body text-slate-500">No payments recorded yet.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {payments.map((p) => (
                    <li key={p.id} className="flex justify-between text-body">
                      <span className="font-mono text-caption text-slate-500">{p.utrNumber}</span>
                      <span className="ledger-figure">{formatINR(p.amount)}</span>
                      <span className="text-caption text-slate-500">{formatDate(p.paymentDate)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card>
            <p className="mb-4 font-display text-heading text-ink-950">Record a Payment</p>
            {loan.status !== "DISBURSED" ? (
              <p className="text-body text-slate-500">
                This loan is {loan.status.toLowerCase()} - no further payments can be recorded.
              </p>
            ) : (
              <RecordPaymentForm
                loan={loan}
                onRecorded={(updated) => {
                  setLoan(updated);
                  load();
                }}
              />
            )}
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}

export default function CollectionDetailPage() {
  return (
    <RoleGuard allow={[Role.COLLECTION]}>
      <CollectionDetailContent />
    </RoleGuard>
  );
}
