import fs from "fs";
import { PrivacyBudget, addDifferentialPrivacy } from "../crypto/privacy.mjs";
import { decryptValue } from "../crypto/encryption.mjs";

// condition map same as earlier
const conditionMap = { diabetes:1, hypertension:2, asthma:3 };

function countPlainEncrypted(data, query) {
  let count = 0;
  for (const r of data) {
    const age = decryptValue(r.encrypted_age);
    const cond = decryptValue(r.encrypted_condition);
    if (age >= query.ageMin && age <= query.ageMax && cond === conditionMap[query.condition]) count++;
  }
  return count;
}

(async () => {
  const data = JSON.parse(fs.readFileSync("data/patients_encrypted.json","utf8"));
  const budget = new PrivacyBudget(5.0); // smaller budget for demo

  const query = { ageMin: 30, ageMax: 40, condition: "diabetes" };
  console.log("True query:", query);

  // run the same query 6 times to demonstrate budget exhaustion & noise
  for (let i = 0; i < 6; i++) {
    const epsilon = 1.0;
    try {
      if (!budget.canRunQuery(epsilon)) throw new Error("privacy_exhausted");
      const trueCount = countPlainEncrypted(data, query);
      const noisy = addDifferentialPrivacy(trueCount, epsilon);
      budget.recordQuery(epsilon, query);
      console.log(`Run ${i+1}: noisyCount=${noisy} (true=${trueCount}), budgetRemaining=${budget.getRemainingBudget()}`);
    } catch (e) {
      console.log(`Run ${i+1}: ERROR - ${e.message}`);
    }
  }

  console.log("\nQuery history:", budget.getHistory());
})();
