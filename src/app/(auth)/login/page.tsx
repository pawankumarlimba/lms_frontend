"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiClientError } from "@/lib/api/HttpClient";
import { ROLE_HOME_ROUTE } from "@/lib/constants/roles";
import { Button, Input, Card, Alert } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      router.push(ROLE_HOME_ROUTE[user.role]);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <Card className="w-full max-w-sm">
        <p className="mb-1 font-display text-display-md text-ink-950">Ledger LMS</p>
        <p className="mb-6 text-body text-slate-500">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <Alert tone="danger">{error}</Alert>}
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Log in
          </Button>
        </form>
        <p className="mt-4 text-center text-caption text-slate-500">
          New borrower?{" "}
          <Link href="/signup" className="text-navy-700 underline">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
