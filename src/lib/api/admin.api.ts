import { HttpClient } from "@/lib/api/HttpClient";
import { IDashboardOverview } from "@/types/loan";

class AdminApi extends HttpClient {
  constructor() {
    super();
  }

  public getOverview(): Promise<IDashboardOverview> {
    return this.get<IDashboardOverview>("/dashboard/admin/overview");
  }
}

export const adminApi = new AdminApi();
