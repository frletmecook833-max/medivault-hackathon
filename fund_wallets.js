import fs from 'fs';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const RPC_URL = process.env.RPC_URL;
const OWNER_PK = process.env.OWNER_PRIVATE_KEY;
const FUND_AMT = process.env.FUND_AMOUNT_ETH || "0.01";

if (!RPC_URL || !OWNER_PK) {
  console.error("ERROR: Missing RPC_URL or OWNER_PRIVATE_KEY in .env");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const owner = new ethers.Wallet(OWNER_PK, provider);

const wallets = JSON.parse(fs.readFileSync('demo/patient_wallets.json', 'utf8'));

async function main() {
  console.log("Funding wallets from owner:", owner.address);

  for (const w of wallets) {
    const tx = await owner.sendTransaction({
      to: w.address,
      value: ethers.parseEther(FUND_AMT),
      gasLimit: 210000
    });

    console.log(`→ Funding ${w.address} | tx: ${tx.hash}`);
    await tx.wait();
  }

  console.log("✅ All wallets funded!");
}

main().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
