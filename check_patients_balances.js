import fs from 'fs';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallets = JSON.parse(fs.readFileSync('demo/patient_wallets.json','utf8'));

(async () => {
  console.log("Checking all patient wallet balances:\n");
  for (const w of wallets) {
    const bal = await provider.getBalance(w.address);
    console.log(`${w.address}  =>  ${ethers.formatEther(bal)} ETH`);
  }
})();
