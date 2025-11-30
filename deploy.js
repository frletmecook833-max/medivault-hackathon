// scripts/deploy.js (ES module — for projects with "type": "module")
import hre from "hardhat";
import fs from "fs";

function getParseEther(hreEthers) {
  return hreEthers.parseEther ?? hreEthers.utils?.parseEther;
}
function getFormatEther(hreEthers) {
  return hreEthers.formatEther ?? hreEthers.utils?.formatEther;
}

async function main() {
  console.log("🚀 Deploying MediVaultPayments to Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const parseEther = getParseEther(hre.ethers);
  const formatEther = getFormatEther(hre.ethers);

  const minNeeded = parseEther("0.01");

  let sufficient = true;
  if (typeof balance === "bigint" || typeof minNeeded === "bigint") {
    sufficient = BigInt(balance) >= BigInt(minNeeded);
  } else if (balance && typeof balance.lt === "function") {
    sufficient = !balance.lt(minNeeded);
  } else {
    sufficient = Number(formatEther(balance)) >= Number(formatEther(minNeeded));
  }

  console.log("💰 Account balance:", formatEther(balance), "ETH\n");

  if (!sufficient) {
    console.error("❌ Insufficient funds! Need at least 0.01 SepoliaETH");
    console.error("Get funds from: https://www.alchemy.com/faucets/ethereum-sepolia");
    process.exit(1);
  }

  console.log("⏳ Deploying contract...");
  const MediVaultPayments = await hre.ethers.getContractFactory("MediVaultPayments");
  const contract = await MediVaultPayments.deploy();

  // cross-version waiting
  if (typeof contract.waitForDeployment === "function") {
    await contract.waitForDeployment();
  } else {
    await contract.deployed();
  }

  const contractAddress = typeof contract.getAddress === "function"
    ? await contract.getAddress()
    : contract.address;

  console.log("\n✅ MediVaultPayments deployed!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🔗 View on Etherscan: https://sepolia.etherscan.io/address/" + contractAddress);

  const deploymentInfo = {
    network: "sepolia",
    contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    etherscanUrl: `https://sepolia.etherscan.io/address/${contractAddress}`
  };

  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  fs.writeFileSync("deployed_address.txt", contractAddress);

  console.log("\n📄 Deployment info saved to deployment-info.json and deployed_address.txt");

  // short pause then print verify command
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log("\n🔍 Now run verification (example):");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
  console.log("If contract has constructor args, add them after the address.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ deploy error:", err);
    process.exit(1);
  });

