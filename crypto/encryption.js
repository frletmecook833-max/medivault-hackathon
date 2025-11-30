// crypto/encryption.js
// Simple deterministic "encryption" fallback + minimal API used by the demo
// WARNING: This is NOT real homomorphic encryption. Use only for demo fallback.

import crypto from 'crypto';

const KEY = 'demo_secret_key_please_change';
const conditionMap = { diabetes: 1, hypertension: 2, asthma: 3, cancer: 4 };

function sha256hex(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// deterministic "encrypt" for demo: returns hex string
export function encryptValue(value) {
  // value can be number or string
  const plain = String(value);
  // simple XOR-like obfuscation + hash to produce fixed-length "ciphertext"
  const xored = Array.from(plain).map((ch, i) =>
    (ch.charCodeAt(0) ^ KEY.charCodeAt(i % KEY.length)).toString(16).padStart(2, '0')
  ).join('');
  return sha256hex(xored + KEY).slice(0, 128); // 128 hex chars ~ 512 bits (demo only)
}

export function decryptValue(_ciphertext) {
  // fallback cannot decrypt; in real fallback we keep mapping table for demo verification
  // For simplicity, client code that needs "decryption" will use a small in-memory map.
  throw new Error('decryptValue is not supported in fallback mode');
}

export function encryptCondition(condition) {
  const code = conditionMap[condition.toLowerCase()];
  if (!code) throw new Error('Unknown condition: ' + condition);
  return encryptValue(code);
}

export { conditionMap };
