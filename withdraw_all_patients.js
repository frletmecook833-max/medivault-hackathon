import fs from 'fs';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync(process.env.ABI_PATH || './abi.json', 'utf8'));

async function main() {
  const wallets = JSON.parse(fs.readFileSync('demo/patient_wallets.json', 'utf8'));

  for (const w of wallets) {
    try {
      const signer = new ethers.Wallet(w.privateKey, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      console.log(`Withdrawing for: ${w.address}`);
      const tx = await contract.withdrawEarnings({ gasLimit: 300000 });
      console.log("→ tx:", tx.hash);
      await tx.wait();
    } catch (err) {
      console.error(`Error withdrawing for ${w.address}`, err.message);
    }
  }

  console.log("✅ All withdrawals attempted.");
}

main().catch(console.error);
