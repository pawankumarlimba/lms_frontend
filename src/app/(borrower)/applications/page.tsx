"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { borrowerApi } from "@/lib/api/borrower.api";
import { ILoanApplication } from "@/types/loan";
import { Navbar } from "@/components/layout/Navbar";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Card, Button, Spinner, EmptyState } from "@/components/ui";
import { formatINR } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

export default function MyApplicationsPage() {
  const [loans, setLoans] = useState<ILoanApplication[] | null>(null);

  useEffect(() => {
    borrowerApi.getMyApplications().then(setLoans);
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar title="My Loan Applications" />
      <div className="mx-auto max-w-shell px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-body text-slate-500">Track every application you&apos;ve submitted.</p>
          <Link href="/apply/personal-details">
            <Button className="" variant="accent">New Application</Button>
          </Link>
        </div>

        {loans === null ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : loans.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Start a new loan application to see it here."
            action={
              <Link href="/apply/personal-details">
                <Button>Apply for a loan</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {loans.map((loan) => (
              <Link key={loan.id} href={`/applications/${loan.id}`}>
                <Card className="flex flex-col gap-2 transition-shadow hover:shadow-raised">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-caption text-slate-500">#{loan.id.slice(-8)}</span>
                    <StatusBadge status={loan.status} />
                  </div>
                  <p className="ledger-figure text-display-md text-navy-700">{formatINR(loan.principal)}</p>
                  <p className="text-caption text-slate-500">
                    {loan.tenureDays} days &middot; applied {formatDate(loan.createdAt)}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
