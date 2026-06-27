"use client";

import { ReactNode, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export function DashboardShell({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar
        role={user.role}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />
      {/* min-w-0 stops a wide table inside from forcing the whole page to scroll horizontally */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="mx-auto w-full max-w-shell flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}