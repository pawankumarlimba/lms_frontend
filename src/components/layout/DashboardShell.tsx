"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export function DashboardShell({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar role={user.role} />
      <div className="flex flex-1 flex-col">
        <Navbar title={title} />
        <main className="mx-auto w-full max-w-shell flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
