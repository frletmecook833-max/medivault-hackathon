import fs from "fs";
import { encryptValue } from "../crypto/encryption.mjs";

// map conditions to numbers
const conditionMap = {
  diabetes: 1,
  hypertension: 2,
  asthma: 3
};

// map treatments to numbers
const treatmentMap = {
  metformin: 1,
  lisinopril: 2,
  albuterol: 3
};

function encryptCondition(condition) {
  const code = conditionMap[condition];
  if (!code) throw new Error("Unknown condition: " + condition);
  return encryptValue(code);
}

function encryptTreatment(treatment) {
  const code = treatmentMap[treatment];
  if (!code) throw new Error("Unknown treatment: " + treatment);
  return encryptValue(code);
}

(async () => {
  const patients = JSON.parse(fs.readFileSync("data/patients.json", "utf8"));
  console.log("Encrypting", patients.length, "patients...");

  const encrypted = [];

  for (let i = 0; i < patients.length; i++) {
    const p = patients[i];

    encrypted.push({
      id: p.id,
      encrypted_age: encryptValue(p.age),
      encrypted_condition: encryptCondition(p.condition),
      encrypted_treatment: encryptTreatment(p.treatment)
    });

    if ((i + 1) % 100 === 0) {
      console.log(`Encrypted ${i + 1}/${patients.length}`);
    }
  }

  fs.writeFileSync("data/patients_encrypted.json", JSON.stringify(encrypted, null, 2), "utf8");
  console.log("✅ All data encrypted → data/patients_encrypted.json");
})();
