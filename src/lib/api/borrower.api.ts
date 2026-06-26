import { HttpClient } from "@/lib/api/HttpClient";
import { EmploymentMode, IBorrowerProfile, ILoanApplication } from "@/types/loan";

export interface IPersonalDetailsPayload {
  fullName: string;
  panNumber: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: EmploymentMode;
}

export interface IApplyLoanPayload {
  principal: number;
  tenureDays: number;
  salarySlip: File;
}

class BorrowerApi extends HttpClient {
  constructor() {
    super();
  }

  public submitPersonalDetails(payload: IPersonalDetailsPayload): Promise<IBorrowerProfile> {
    return this.post<IBorrowerProfile>("/borrower/personal-details", payload);
  }

  public applyForLoan(payload: IApplyLoanPayload): Promise<ILoanApplication> {
    const formData = new FormData();
    formData.append("principal", String(payload.principal));
    formData.append("tenureDays", String(payload.tenureDays));
    formData.append("salarySlip", payload.salarySlip);

    return this.post<ILoanApplication>("/borrower/apply", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  public getMyApplications(): Promise<ILoanApplication[]> {
    return this.get<ILoanApplication[]>("/borrower/applications");
  }

  public getApplicationById(loanId: string): Promise<ILoanApplication> {
    return this.get<ILoanApplication>(`/borrower/applications/${loanId}`);
  }
}

export const borrowerApi = new BorrowerApi();
