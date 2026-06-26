export enum LoanStatus {
  APPLIED = "APPLIED",
  SANCTIONED = "SANCTIONED",
  REJECTED = "REJECTED",
  DISBURSED = "DISBURSED",
  CLOSED = "CLOSED",
}

export enum EmploymentMode {
  SALARIED = "SALARIED",
  SELF_EMPLOYED = "SELF_EMPLOYED",
  UNEMPLOYED = "UNEMPLOYED",
}

export interface IBreRuleResult {
  rule: string;
  passed: boolean;
  reason?: string;
}

export interface IBorrowerProfile {
  id: string;
  userId: string;
  panNumber: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  breStatus: "PASSED" | "REJECTED";
  breResults: IBreRuleResult[];
}

export interface ISalarySlip {
  url: string;
  publicId: string;
  mimeType: string;
  sizeBytes: number;
}

export interface ILoanApplication {
  id: string;
  borrowerId: string | { id: string; fullName: string; email: string; phone?: string };
  borrowerProfileId: string | IBorrowerProfile;
  salarySlip: ISalarySlip;
  principal: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingAmount: number;
  status: LoanStatus;
  rejectionReason?: string;
  createdAt: string;
  sanctionedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
}

export interface IPayment {
  id: string;
  loanApplicationId: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
  recordedBy: string;
  createdAt: string;
}

export interface IDashboardOverview {
  leads: number;
  applied: number;
  sanctioned: number;
  rejected: number;
  disbursed: number;
  closed: number;
  totalLoans: number;
}
