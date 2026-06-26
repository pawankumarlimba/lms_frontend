"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Role } from "@/types/user";
import { Spinner } from "@/components/ui";

/**
 * RoleGuard is client-side UX only (hide nav items, redirect away).
 * The backend RBAC middleware is the real, unbypassable gate - this guard
 * just avoids flashing dashboard chrome at someone who isn't allowed in.
 */
export function RoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== Role.ADMIN && !allow.includes(user.role)) {
      router.replace("/login");
    }
  }, [isLoading, user, allow, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-paper">
        <Spinner />
      </div>
    );
  }

  if (user.role !== Role.ADMIN && !allow.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
