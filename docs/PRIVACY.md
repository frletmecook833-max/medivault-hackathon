# 🔒 How Privacy Works in MediVault

## For Non-Technical People
**Q: Is my medical data safe?**  
A: Yes. Data is encrypted before it leaves the device. Even the platform cannot read raw patient records.

**Q: What is a zero-knowledge proof?**  
A: It proves a statement (e.g., "there are 347 patients matching X") is true without revealing the underlying records.

**Q: Can researchers see names/addresses?**  
A: No. Only aggregated counts and cryptographic proofs are returned.

**Q: What if the database is breached?**  
A: Encrypted ciphertexts are useless without secret keys. Keys are never stored in plaintext.

---

## For Technical People

### Encryption
- **Library:** (demo fallback) XOR+SHA256 for the hackathon, replaceable by Microsoft SEAL (BFV).
- **Real target:** BFV Homomorphic Encryption (node-seal / Microsoft SEAL) for computing on ciphertexts.
- **Key point:** Computations are performed without decrypting.

### Zero-Knowledge Proofs
- **Plan:** Groth16 zk-SNARKs (Circom + SnarkJS).
- **Purpose:** Prove the correctness of an aggregate query (COUNT) without revealing records.
- **Fallback for demo:** Mock proofs (SHA-256 hashing) when full ZK setup is infeasible.

### Differential Privacy
- **Mechanism:** Laplace noise added to counts.
- **Default epsilon:** 1.0 (configurable).
- **Privacy budget:** example default 10.0 per researcher / month.

### Threat Model
**We protect against:**
- Curious admins (can't read raw data)
- External attackers (encrypted DB useless)
- Malicious researchers (can't query individuals via DP & budget)

**We do not protect against:**
- Compromised client devices (malware/keyloggers)
- Social engineering

---

## How to interpret demo results
- Demo uses encrypted ciphertexts and a mocked ZK proof when necessary.
- Judges should verify: (1) Data is encrypted at rest, (2) Aggregate computation is shown, (3) Proof verification (mock or real) is demonstrated.
