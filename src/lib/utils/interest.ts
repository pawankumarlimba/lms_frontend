export interface IInterestBreakdown {
  principal: number;
  interest: number;
  totalRepayment: number;
}

/**
 * Mirrors backend services/loan/InterestCalculator.ts. Kept as the same
 * abstract-base + concrete-subclass shape so the two can be compared
 * line-by-line, and so a future rate model change is a drop-in subclass
 * on both sides instead of a divergent one-off formula.
 */
export abstract class InterestCalculator {
  protected constructor(protected readonly annualRatePercent: number) {}
  public abstract calculate(principal: number, tenureDays: number): IInterestBreakdown;
}

export class SimpleInterestCalculator extends InterestCalculator {
  constructor(annualRatePercent = 12) {
    super(annualRatePercent);
  }

  public calculate(principal: number, tenureDays: number): IInterestBreakdown {
    const interest = (principal * this.annualRatePercent * tenureDays) / (365 * 100);
    const roundedInterest = Math.round(interest * 100) / 100;
    const totalRepayment = Math.round((principal + roundedInterest) * 100) / 100;
    return { principal, interest: roundedInterest, totalRepayment };
  }
}
