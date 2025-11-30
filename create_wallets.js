import fs from 'fs';
import { Wallet } from 'ethers';

const N = 10; // number of wallets
const outDir = 'demo';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const wallets = [];
for (let i = 0; i < N; i++) {
  const w = Wallet.createRandom();
  wallets.push({ index: i, address: w.address, privateKey: w.privateKey });
}

fs.writeFileSync(`${outDir}/patient_wallets.json`, JSON.stringify(wallets, null, 2));
console.log(`Created ${N} wallets -> demo/patient_wallets.json`);
console.log(wallets.map(w => `${w.index}: ${w.address}`).join('\n'));
