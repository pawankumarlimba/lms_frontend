"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui";

export function Navbar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <h1 className="font-display text-heading text-ink-950">{title}</h1>
      <div className="flex items-center gap-4">
        {user && (
          <div className="text-right">
            <p className="text-body text-ink-950">{user.fullName}</p>
            <p className="text-caption text-slate-500">{user.email}</p>
          </div>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
