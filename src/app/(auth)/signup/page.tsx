"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiClientError } from "@/lib/api/HttpClient";
import { Button, Input, Card, Alert } from "@/components/ui";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signup({ fullName, email, phone, password });
      router.push("/apply/personal-details");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <Card className="w-full max-w-sm">
        <p className="mb-1 font-display text-display-md text-ink-950">Ledger LMS</p>
        <p className="mb-6 text-body text-slate-500">Create your borrower account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <Alert tone="danger">{error}</Alert>}
          <Input label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input
            label="Password"
            type="password"
            required
            hint="At least 8 characters, with a letter and a number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>
        <p className="mt-4 text-center text-caption text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-navy-700 underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
