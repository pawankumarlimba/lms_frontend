"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Role } from "@/types/user";
import { salesApi, ILead } from "@/lib/api/sales.api";
import { Card, Spinner, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils/date";

function SalesContent() {
  const [leads, setLeads] = useState<ILead[] | null>(null);

  useEffect(() => {
    salesApi.getLeads().then((res) => setLeads(res.items));
  }, []);

  return (
    <DashboardShell title="Sales — Leads">
      <p className="mb-6 text-body text-slate-500">
        Registered borrowers who haven&apos;t submitted a loan application yet.
      </p>
      {leads === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : leads.length === 0 ? (
        <EmptyState title="No open leads" description="Every registered borrower has applied for a loan." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="flex flex-col gap-1">
              <p className="font-display text-heading text-ink-950">{lead.fullName}</p>
              <p className="text-body text-slate-500">{lead.email}</p>
              {lead.phone && <p className="text-body text-slate-500">{lead.phone}</p>}
              <p className="mt-2 text-caption text-slate-500">Registered {formatDate(lead.createdAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}

export default function SalesPage() {
  return (
    <RoleGuard allow={[Role.SALES]}>
      <SalesContent />
    </RoleGuard>
  );
}
