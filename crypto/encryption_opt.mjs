import * as base from "./encryption.mjs";

// Simple in-memory cache for encrypted values
const encryptionCache = new Map();

export function encryptValueCached(value) {
  const key = String(value);
  if (encryptionCache.has(key)) return encryptionCache.get(key);
  const encrypted = base.encryptValue(value);
  encryptionCache.set(key, encrypted);
  return encrypted;
}

// Precompute encrypted ages into data/precomputed_ages.json (18..80)
export async function precomputeAges(min = 18, max = 80) {
  const fs = await import("fs");
  const pre = {};
  for (let age = min; age <= max; age++) {
    pre[age] = encryptValueCached(age);
  }
  fs.writeFileSync("data/precomputed_ages.json", JSON.stringify(pre, null, 2), "utf8");
  return pre;
}

// Encrypt a batch of patients with onProgress callback (percent 0-100)
export async function encryptWithProgress(patients, onProgress = () => {}) {
  const encrypted = [];
  const total = patients.length;
  for (let i = 0; i < total; i++) {
    const p = patients[i];
    encrypted.push({
      id: p.id,
      encrypted_age: encryptValueCached(p.age),
      encrypted_condition: encryptValueCached(p.condition), // small values map to ints in earlier scripts
      encrypted_treatment: encryptValueCached(p.treatment)
    });

    // report progress every 5% or on last item
    if (i === total - 1 || (i + 1) % Math.max(1, Math.floor(total / 20)) === 0) {
      const percent = Math.round(((i + 1) / total) * 100);
      try { onProgress(percent); } catch (e) { /* ignore */ }
    }
  }
  return encrypted;
}

// Expose cache clear helper
export function clearEncryptionCache() {
  encryptionCache.clear();
}
