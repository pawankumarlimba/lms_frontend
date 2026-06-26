import { LoanStatus } from "@/types/loan";

export type StatusTone = "success" | "danger" | "warning" | "neutral";

interface IStatusConfig {
  label: string;
  tone: StatusTone;
}

export const LOAN_STATUS_CONFIG: Record<LoanStatus, IStatusConfig> = {
  [LoanStatus.APPLIED]: { label: "Applied", tone: "warning" },
  [LoanStatus.SANCTIONED]: { label: "Sanctioned", tone: "success" },
  [LoanStatus.REJECTED]: { label: "Rejected", tone: "danger" },
  [LoanStatus.DISBURSED]: { label: "Disbursed", tone: "success" },
  [LoanStatus.CLOSED]: { label: "Closed", tone: "neutral" },
};
