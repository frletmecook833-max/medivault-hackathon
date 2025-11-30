import fs from "fs";
import { encryptWithProgress } from "../crypto/encryption_opt.mjs";

(async () => {
  const patients = JSON.parse(fs.readFileSync("data/patients.json","utf8"));
  console.log("Encrypting with progress (cached) ...");

  const encrypted = await encryptWithProgress(patients, (percent) => {
    console.log(`Progress: ${percent}%`);
  });

  fs.writeFileSync("data/patients_encrypted_opt.json", JSON.stringify(encrypted, null, 2), "utf8");
  console.log("✅ All data encrypted -> data/patients_encrypted_opt.json");
})();
