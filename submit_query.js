import fs from 'fs';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ABI_PATH = process.env.ABI_PATH || './abi.json';
const RESEARCHER_PK = process.env.RESEARCHER_PRIVATE_KEY;

if (!RPC_URL || !CONTRACT_ADDRESS) {
  console.error("Missing RPC_URL or CONTRACT_ADDRESS in .env");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const researcher = new ethers.Wallet(RESEARCHER_PK, provider);

const abi = JSON.parse(fs.readFileSync(ABI_PATH, 'utf8'));
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, researcher);

async function main() {
  const patients = JSON.parse(fs.readFileSync('demo/patient_wallets.json', 'utf8'));
  const patientCount = patients.length;
  
  const PAYMENT_ETH = "0.001";

  console.log(`Submitting query with ${patientCount} patients`);
  const tx = await contract.submitQuery(patientCount, {
    value: ethers.parseEther(PAYMENT_ETH),
    gasLimit: 800000
  });

  console.log("tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("Confirmed at block:", receipt.blockNumber);
}

main().catch(console.error);
