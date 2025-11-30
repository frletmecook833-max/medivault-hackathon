import { precomputeAges } from "../crypto/encryption_opt.mjs";

(async () => {
  console.log("Precomputing ages 18-80...");
  await precomputeAges(18, 80);
  console.log("✅ precomputed -> data/precomputed_ages.json");
})();
