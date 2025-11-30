export function addDifferentialPrivacy(trueCount, epsilon = 1.0) {
  const u = Math.random() - 0.5;
  const noise = -Math.sign(u) * Math.log(1 - 2 * Math.abs(u)) / epsilon;
  const noisy = Math.round(trueCount + noise);
  return Math.max(0, noisy);
}

export class PrivacyBudget {
  constructor(totalBudget = 10.0) {
    this.totalBudget = totalBudget;
    this.spent = 0;
    this.queries = [];
  }
  canRunQuery(epsilon) { return (this.spent + epsilon) <= this.totalBudget; }
  recordQuery(epsilon, query) { if (!this.canRunQuery(epsilon)) throw new Error('Privacy budget exhausted'); this.spent += epsilon; this.queries.push({ epsilon, query, timestamp: Date.now() }); }
  getRemainingBudget() { return this.totalBudget - this.spent; }
}
