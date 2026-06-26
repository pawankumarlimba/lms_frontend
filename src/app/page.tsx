"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ROLE_HOME_ROUTE } from "@/lib/constants/roles";
import { Spinner } from "@/components/ui";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? ROLE_HOME_ROUTE[user.role] : "/login");
  }, [isLoading, user, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-paper">
      <Spinner />
    </div>
  );
}
