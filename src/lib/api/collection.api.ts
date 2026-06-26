import { HttpClient } from "@/lib/api/HttpClient";
import { IPaginatedResult } from "@/types/api";
import { ILoanApplication, IPayment } from "@/types/loan";

export interface IRecordPaymentPayload {
  utrNumber: string;
  amount: number;
  paymentDate: string;
}

export interface IRecordPaymentResult {
  payment: IPayment;
  loan: ILoanApplication;
}

class CollectionApi extends HttpClient {
  constructor() {
    super();
  }

  public getDisbursedLoans(page = 1, limit = 20): Promise<IPaginatedResult<ILoanApplication>> {
    return this.get<IPaginatedResult<ILoanApplication>>("/dashboard/collection/disbursed", {
      params: { page, limit },
    });
  }

  public getLoanById(loanId: string): Promise<ILoanApplication> {
    return this.get<ILoanApplication>(`/dashboard/collection/${loanId}`);
  }

  public recordPayment(loanId: string, payload: IRecordPaymentPayload): Promise<IRecordPaymentResult> {
    return this.post<IRecordPaymentResult>(`/dashboard/collection/${loanId}/payments`, payload);
  }

  public getPaymentsForLoan(loanId: string): Promise<IPayment[]> {
    return this.get<IPayment[]>(`/dashboard/collection/${loanId}/payments`);
  }
}

export const collectionApi = new CollectionApi();
