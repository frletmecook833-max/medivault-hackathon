import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const owner = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);

(async () => {
  const bal = await provider.getBalance(owner.address);
  console.log('Owner address:', owner.address);
  console.log('Owner balance (ETH):', ethers.formatEther(bal));
})();
