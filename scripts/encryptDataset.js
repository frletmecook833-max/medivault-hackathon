// scripts/encryptDataset.js
import fs from 'fs';
import { encryptValue, encryptCondition } from '../crypto/encryption.js';

const IN = 'data/patients.json';
const OUT = 'data/patients_encrypted.json';

if (!fs.existsSync(IN)) {
  console.error('Missing input data:', IN);
  process.exit(1);
}

const patients = JSON.parse(fs.readFileSync(IN, 'utf8'));

const encrypted = patients.map(p => ({
  id: p.id ?? null,
  encrypted_age: encryptValue(p.age),
  encrypted_condition: encryptCondition(p.condition),
  // keep original small fields for demo (id only) — do not include PII
}));

fs.writeFileSync(OUT, JSON.stringify(encrypted, null, 2), 'utf8');
console.log('Wrote', OUT, 'records:', encrypted.length);
