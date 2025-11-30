import fs from "fs";
import { decryptValue } from "../crypto/encryption.mjs";

// Query: age range and condition (condition numbers: 1=diabetes,2=hypertension,3=asthma)
const conditionMap = { diabetes:1, hypertension:2, asthma:3 };

function matchRecord(record, q) {
  const age = decryptValue(record.encrypted_age);
  const cond = decryptValue(record.encrypted_condition);
  return age >= q.ageMin && age <= q.ageMax && cond === conditionMap[q.condition];
}

(async () => {
  const data = JSON.parse(fs.readFileSync("data/patients_encrypted.json","utf8"));
  const query = { ageMin: 30, ageMax: 40, condition: "diabetes" }; // edit if needed
  console.log("Running query:", query);

  let count = 0;
  for (const r of data) {
    if (matchRecord(r, query)) count++;
  }

  console.log(`Query result: ${count} patients`);
})();
