import { HttpClient } from "@/lib/api/HttpClient";
import { IPaginatedResult } from "@/types/api";

export interface ILead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

class SalesApi extends HttpClient {
  constructor() {
    super();
  }

  public getLeads(page = 1, limit = 20): Promise<IPaginatedResult<ILead>> {
    return this.get<IPaginatedResult<ILead>>("/dashboard/sales/leads", { params: { page, limit } });
  }
}

export const salesApi = new SalesApi();
