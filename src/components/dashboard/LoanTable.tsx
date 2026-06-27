import { ReactNode } from "react";
import { ILoanApplication } from "@/types/loan";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatINR } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { EmptyState } from "@/components/ui";

interface LoanTableProps {
  loans: ILoanApplication[];
  renderActions?: (loan: ILoanApplication) => ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
}

function borrowerName(loan: ILoanApplication): string {
  if (typeof loan.borrowerId === "object" && loan.borrowerId) return loan.borrowerId.fullName;
  return "-";
}

export function LoanTable({ loans, renderActions, emptyTitle, emptyDescription }: LoanTableProps) {
  if (loans.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-border bg-paper-muted text-label uppercase text-slate-500">
            <th className="px-4 py-3">Borrower</th>
            <th className="px-4 py-3">Principal</th>
            <th className="hidden px-4 py-3 sm:table-cell">Tenure</th>
            <th className="px-4 py-3">Total Repayment</th>
            <th className="px-4 py-3">Status</th>
            <th className="hidden px-4 py-3 lg:table-cell">Applied On</th>
            {renderActions && <th className="px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-body text-ink-950">{borrowerName(loan)}</td>
              <td className="px-4 py-3 font-mono text-body text-ink-950">{formatINR(loan.principal)}</td>
              <td className="hidden px-4 py-3 text-body text-slate-500 sm:table-cell">{loan.tenureDays} days</td>
              <td className="px-4 py-3 font-mono text-body text-navy-700">{formatINR(loan.totalRepayment)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={loan.status} />
              </td>
              <td className="hidden px-4 py-3 text-body text-slate-500 lg:table-cell">{formatDate(loan.createdAt)}</td>
              {renderActions && <td className="px-4 py-3">{renderActions(loan)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}