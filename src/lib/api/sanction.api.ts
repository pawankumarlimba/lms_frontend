import { HttpClient } from "@/lib/api/HttpClient";
import { IPaginatedResult } from "@/types/api";
import { ILoanApplication } from "@/types/loan";

class SanctionApi extends HttpClient {
  constructor() {
    super();
  }

  public getAppliedLoans(page = 1, limit = 20): Promise<IPaginatedResult<ILoanApplication>> {
    return this.get<IPaginatedResult<ILoanApplication>>("/dashboard/sanction/applied", {
      params: { page, limit },
    });
  }

  public sanctionLoan(loanId: string): Promise<ILoanApplication> {
    return this.patch<ILoanApplication>(`/dashboard/sanction/${loanId}/sanction`);
  }

  public rejectLoan(loanId: string, reason: string): Promise<ILoanApplication> {
    return this.patch<ILoanApplication>(`/dashboard/sanction/${loanId}/reject`, { reason });
  }
}

export const sanctionApi = new SanctionApi();
