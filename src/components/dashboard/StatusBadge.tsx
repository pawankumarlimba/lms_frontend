import { Badge } from "@/components/ui/Badge";
import { LOAN_STATUS_CONFIG } from "@/lib/constants/loanStatus";
import { LoanStatus } from "@/types/loan";

export function StatusBadge({ status }: { status: LoanStatus }) {
  const config = LOAN_STATUS_CONFIG[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
