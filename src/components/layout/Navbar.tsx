"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui";

interface NavbarProps {
  title: string;
  onMenuClick?: () => void;
}

export function Navbar({ title, onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1 rounded-md hover:bg-paper-muted md:hidden"
          >
            <span className="h-0.5 w-5 bg-ink-950" />
            <span className="h-0.5 w-5 bg-ink-950" />
            <span className="h-0.5 w-5 bg-ink-950" />
          </button>
        )}
        <h1 className="truncate font-display text-heading text-ink-950">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        {user && (
          <div className="hidden text-right sm:block">
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