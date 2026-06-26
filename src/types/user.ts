export enum Role {
  ADMIN = "ADMIN",
  SALES = "SALES",
  SANCTION = "SANCTION",
  DISBURSEMENT = "DISBURSEMENT",
  COLLECTION = "COLLECTION",
  BORROWER = "BORROWER",
}

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  phone?: string;
}

export interface IAuthResult {
  token: string;
  user: IUser;
}
