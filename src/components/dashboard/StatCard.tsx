import { Card } from "@/components/ui";

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-label uppercase text-slate-500">{label}</span>
      <span className="ledger-figure text-display-md text-navy-700">{value}</span>
    </Card>
  );
}
