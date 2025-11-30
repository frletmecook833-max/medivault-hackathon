import fs from 'fs';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const RPC_URL = process.env.RPC_URL;
const OWNER_PK = process.env.OWNER_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ABI_PATH = process.env.ABI_PATH || './abi.json';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const owner = new ethers.Wallet(OWNER_PK, provider);

const abi = JSON.parse(fs.readFileSync(ABI_PATH));
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, owner);

async function main() {
  const wallets = JSON.parse(fs.readFileSync('demo/patient_wallets.json'));
  const addresses = wallets.map(w => w.address);

  const queryId = 0;
  const BATCH = 5;  // change to 50 if needed

  for (let i = 0; i < addresses.length; i += BATCH) {
    const batch = addresses.slice(i, i + BATCH);

    console.log(`Batch ${i/BATCH + 1}: sending to ${batch.length} wallets`);
    const tx = await contract.distributePaymentsBatch(
      queryId,
      batch,
      batch.length,
      { gasLimit: 1500000 }
    );

    console.log("→ tx:", tx.hash);
    await tx.wait();
  }

  console.log("✅ All batches distributed!");
}

main().catch(console.error);
