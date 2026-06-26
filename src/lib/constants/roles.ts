import { Role } from "@/types/user";

export const ROLE_HOME_ROUTE: Record<Role, string> = {
  [Role.ADMIN]: "/admin",
  [Role.SALES]: "/sales",
  [Role.SANCTION]: "/sanction",
  [Role.DISBURSEMENT]: "/disbursement",
  [Role.COLLECTION]: "/collection",
  [Role.BORROWER]: "/applications",
};

export const ROLE_LABEL: Record<Role, string> = {
  [Role.ADMIN]: "Admin",
  [Role.SALES]: "Sales",
  [Role.SANCTION]: "Sanction",
  [Role.DISBURSEMENT]: "Disbursement",
  [Role.COLLECTION]: "Collection",
  [Role.BORROWER]: "Borrower",
};
