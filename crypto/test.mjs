import { encryptValue, decryptValue } from "./encryption.mjs";

const original = 35;

console.log("Original:", original);

const encrypted = encryptValue(original);
console.log("Encrypted:", encrypted);

const decrypted = decryptValue(encrypted);
console.log("Decrypted:", decrypted);

console.log(
  decrypted === original ? "✅ TEST PASSED" : "❌ TEST FAILED"
);
