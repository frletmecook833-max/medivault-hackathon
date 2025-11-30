// WHO: normal-user
// PURPOSE: Generate multi-wallet test accounts
// Note: Supports Parrot OS + Node 18 + Hardhat environments

import { ethers } from 'ethers';
import fs from 'fs';

// ------------------------------------------
// SETTINGS
// ------------------------------------------
const WALLET_COUNT = 15; // 1 researcher + 10 patients + 4 spares
const OUTPUT_DIR = "test-wallets";

async function generateWallets() {
  console.log(`🔑 Generating ${WALLET_COUNT} test wallets...\n`);

  // ------------------------------------------
  // Ensure folder exists
  // ------------------------------------------
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created folder: ${OUTPUT_DIR}/`);
  }

  const wallets = [];

  for (let i = 0; i < WALLET_COUNT; i++) {
    const wallet = ethers.Wallet.createRandom();

    const walletData = {
      index: i,
      role: i === 0 ? 'RESEARCHER' : `PATIENT_${i}`,
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase ?? null
    };

    wallets.push(walletData);

    console.log(`✅ Wallet ${i + 1}/${WALLET_COUNT}`);
    console.log(`   Role: ${walletData.role}`);
    console.log(`   Address: ${walletData.address}`);
    console.log(`   Private Key: ${walletData.privateKey}\n`);
  }

  // ------------------------------------------
  // Save data files
  // ------------------------------------------
  fs.writeFileSync(
    `${OUTPUT_DIR}/wallets.json`,
    JSON.stringify(wallets, null, 2)
  );

  fs.writeFileSync(
    `${OUTPUT_DIR}/addresses.json`,
    JSON.stringify(wallets.map(w => w.address), null, 2)
  );

  fs.writeFileSync(
    `${OUTPUT_DIR}/patient-addresses.json`,
    JSON.stringify(wallets.slice(1, 11).map(w => w.address), null, 2)
  );

  console.log('📦 Output files created:');
  console.log(`   - ${OUTPUT_DIR}/wallets.json`);
  console.log(`   - ${OUTPUT_DIR}/addresses.json`);
  console.log(`   - ${OUTPUT_DIR}/patient-addresses.json\n`);

  console.log(`🎉 Completed generating ${WALLET_COUNT} wallets.`);
  return wallets;
}

// Run script
generateWallets()
  .catch(err => {
    console.error("❌ ERROR:", err);
    process.exit(1);
  });

