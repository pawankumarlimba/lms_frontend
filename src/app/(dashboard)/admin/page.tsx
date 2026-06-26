"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Role } from "@/types/user";
import { adminApi } from "@/lib/api/admin.api";
import { IDashboardOverview } from "@/types/loan";
import { StatCard } from "@/components/dashboard/StatCard";
import { Spinner } from "@/components/ui";

function AdminContent() {
  const [overview, setOverview] = useState<IDashboardOverview | null>(null);

  useEffect(() => {
    adminApi.getOverview().then(setOverview);
  }, []);

  return (
    <DashboardShell title="Admin — Overview">
      <p className="mb-6 text-body text-slate-500">A snapshot across every stage of the loan lifecycle.</p>
      {!overview ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Leads" value={overview.leads} />
          <StatCard label="Applied" value={overview.applied} />
          <StatCard label="Sanctioned" value={overview.sanctioned} />
          <StatCard label="Rejected" value={overview.rejected} />
          <StatCard label="Disbursed" value={overview.disbursed} />
          <StatCard label="Closed" value={overview.closed} />
        </div>
      )}
    </DashboardShell>
  );
}

export default function AdminPage() {
  return (
    <RoleGuard allow={[Role.ADMIN]}>
      <AdminContent />
    </RoleGuard>
  );
}
