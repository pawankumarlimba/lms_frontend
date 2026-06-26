export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export interface IClientBreCheck {
  rule: string;
  passed: boolean;
  reason?: string;
}

function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/**
 * Mirrors the backend BusinessRuleEngine purely for instant client-side
 * feedback as the user types. The server re-runs the authoritative version
 * of these exact checks before a BorrowerProfile is ever persisted - this
 * copy can NEVER be the source of truth, only a UX convenience.
 */
export function runClientBreMirror(input: {
  dateOfBirth: string;
  monthlySalary: number;
  panNumber: string;
  employmentMode: string;
}): IClientBreCheck[] {
  const age = input.dateOfBirth ? calculateAge(input.dateOfBirth) : 0;

  return [
    {
      rule: "AGE",
      passed: Boolean(input.dateOfBirth) && age >= 23 && age <= 50,
      reason: "Age must be between 23 and 50 years",
    },
    {
      rule: "SALARY",
      passed: input.monthlySalary >= 25_000,
      reason: "Monthly salary must be at least ₹25,000",
    },
    {
      rule: "PAN_FORMAT",
      passed: PAN_REGEX.test(input.panNumber.toUpperCase()),
      reason: "PAN must match the format ABCDE1234F",
    },
    {
      rule: "EMPLOYMENT",
      passed: input.employmentMode !== "" && input.employmentMode !== "UNEMPLOYED",
      reason: "Unemployed applicants are not eligible",
    },
  ];
}
