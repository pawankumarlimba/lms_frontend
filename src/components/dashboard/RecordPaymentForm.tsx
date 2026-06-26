"use client";

import { FormEvent, useState } from "react";
import { Button, Input, Alert } from "@/components/ui";
import { collectionApi } from "@/lib/api/collection.api";
import { ApiClientError } from "@/lib/api/HttpClient";
import { ILoanApplication } from "@/types/loan";

interface RecordPaymentFormProps {
  loan: ILoanApplication;
  onRecorded: (updatedLoan: ILoanApplication) => void;
}

export function RecordPaymentForm({ loan, onRecorded }: RecordPaymentFormProps) {
  const [utrNumber, setUtrNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await collectionApi.recordPayment(loan.id, {
        utrNumber,
        amount: Number(amount),
        paymentDate,
      });
      onRecorded(result.loan);
      setUtrNumber("");
      setAmount("");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <Input
        label="UTR Number"
        name="utrNumber"
        value={utrNumber}
        onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
        placeholder="Unique transaction reference"
        required
      />
      <Input
        label="Amount (₹)"
        name="amount"
        type="number"
        min={1}
        step="0.01"
        max={loan.outstandingAmount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        hint={`Outstanding: ₹${loan.outstandingAmount.toLocaleString("en-IN")}`}
        required
      />
      <Input
        label="Payment Date"
        name="paymentDate"
        type="date"
        value={paymentDate}
        onChange={(e) => setPaymentDate(e.target.value)}
        required
      />
      <Button type="submit" isLoading={isSubmitting} disabled={loan.outstandingAmount <= 0}>
        Record Payment
      </Button>
    </form>
  );
}
