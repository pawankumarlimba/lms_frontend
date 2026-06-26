import { HttpClient } from "@/lib/api/HttpClient";
import { IPaginatedResult } from "@/types/api";
import { ILoanApplication } from "@/types/loan";

class DisbursementApi extends HttpClient {
  constructor() {
    super();
  }

  public getSanctionedLoans(page = 1, limit = 20): Promise<IPaginatedResult<ILoanApplication>> {
    return this.get<IPaginatedResult<ILoanApplication>>("/dashboard/disbursement/sanctioned", {
      params: { page, limit },
    });
  }

  public disburseLoan(loanId: string): Promise<ILoanApplication> {
    return this.patch<ILoanApplication>(`/dashboard/disbursement/${loanId}/disburse`);
  }
}

export const disbursementApi = new DisbursementApi();
