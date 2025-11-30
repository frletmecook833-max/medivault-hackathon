const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MediVaultPayments", function () {
  let mediVault;
  let owner;
  let researcher;
  let patient1;
  let patient2;

  beforeEach(async function () {
    [owner, researcher, patient1, patient2] = await ethers.getSigners();

    const MediVaultPayments = await ethers.getContractFactory("MediVaultPayments");
    mediVault = await MediVaultPayments.deploy();
    await mediVault.waitForDeployment();
  });

  describe("Query Submission", function () {
    it("Should submit a query with correct payment", async function () {
      const patientCount = 10;
      const paymentAmount = ethers.parseEther("0.001");

      await expect(
        mediVault.connect(researcher).submitQuery(patientCount, { value: paymentAmount })
      )
        .to.emit(mediVault, "QuerySubmitted")
        .withArgs(0, researcher.address, paymentAmount, patientCount, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));

      const query = await mediVault.getQueryDetails(0);
      expect(query.researcher).to.equal(researcher.address);
      expect(query.patientCount).to.equal(patientCount);
    });

    it("Should reject query with insufficient payment", async function () {
      const patientCount = 10;
      const insufficientPayment = ethers.parseEther("0.0001"); // Less than required

      await expect(
        mediVault.connect(researcher).submitQuery(patientCount, { value: insufficientPayment })
      ).to.be.revertedWith("Payment too low");
    });

    it("Should reject query with zero patients", async function () {
      await expect(
        mediVault.connect(researcher).submitQuery(0, { value: ethers.parseEther("0.001") })
      ).to.be.revertedWith("Patient count must be > 0");
    });
  });

  describe("Payment Distribution", function () {
    beforeEach(async function () {
      // Submit a query first
      await mediVault.connect(researcher).submitQuery(2, { value: ethers.parseEther("0.001") });
    });

    it("Should distribute payments to patients", async function () {
      const patients = [patient1.address, patient2.address];

      await expect(
        mediVault.connect(owner).distributePaymentsBatch(0, patients, 2)
      )
        .to.emit(mediVault, "PaymentDistributed");

      const earnings1 = await mediVault.patientEarnings(patient1.address);
      const earnings2 = await mediVault.patientEarnings(patient2.address);

      expect(earnings1).to.be.gt(0);
      expect(earnings2).to.be.gt(0);
      expect(earnings1).to.equal(earnings2); // Equal split
    });

    it("Should only allow owner to distribute payments", async function () {
      const patients = [patient1.address, patient2.address];

      await expect(
        mediVault.connect(researcher).distributePaymentsBatch(0, patients, 2)
      ).to.be.revertedWithCustomError(mediVault, "OwnableUnauthorizedAccount");
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      // Submit query and distribute payments
      await mediVault.connect(researcher).submitQuery(1, { value: ethers.parseEther("0.001") });
      await mediVault.connect(owner).distributePaymentsBatch(0, [patient1.address], 1);
    });

    it("Should allow patient to withdraw earnings", async function () {
      const earnings = await mediVault.patientEarnings(patient1.address);
      const balanceBefore = await ethers.provider.getBalance(patient1.address);

      const tx = await mediVault.connect(patient1).withdrawEarnings();
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(patient1.address);

      expect(balanceAfter).to.equal(balanceBefore + earnings - gasCost);
      expect(await mediVault.patientEarnings(patient1.address)).to.equal(0);
    });

    it("Should reject withdrawal with no earnings", async function () {
      await expect(
        mediVault.connect(patient2).withdrawEarnings()
      ).to.be.revertedWith("No earnings to withdraw");
    });
  });

  describe("Zero-Knowledge Proof", function () {
    it("Should submit query with proof", async function () {
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("test_proof"));
      const resultCount = 347;

      await expect(
        mediVault.connect(researcher).submitQueryWithProof(
          resultCount,
          proofHash,
          resultCount,
          { value: ethers.parseEther("0.02") }
        )
      )
        .to.emit(mediVault, "ProofVerified")
        .withArgs(0, proofHash, resultCount);

      const proof = await mediVault.getProofDetails(0);
      expect(proof.proofHash).to.equal(proofHash);
      expect(proof.verified).to.be.true;
    });
  });
});
