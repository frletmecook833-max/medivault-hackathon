// api/server.mjs
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { PrivacyBudget, addDifferentialPrivacy } from "../crypto/privacy.mjs";
import { decryptValue } from "../crypto/encryption.mjs";

const app = express();
app.use(bodyParser.json());

// mapping of conditions to numbers (used in encryption)
const conditionMap = { diabetes:1, hypertension:2, asthma:3 };

// In-memory privacy budgets keyed by researcher (demo only)
const budgets = {};

function getBudgetForKey(key) {
  if (!budgets[key]) budgets[key] = new PrivacyBudget(10.0);
  return budgets[key];
}

// decrypt + filter dataset
function countPlainEncrypted(data, query) {
  let count = 0;
  for (const r of data) {
    const age = decryptValue(r.encrypted_age);
    const cond = decryptValue(r.encrypted_condition);
    if (age >= query.ageMin && age <= query.ageMax && cond === conditionMap[query.condition]) {
      count++;
    }
  }
  return count;
}

// POST /query  { ageMin, ageMax, condition, epsilon }
app.post("/query", (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"] || "demo";
    const { ageMin = 30, ageMax = 40, condition = "diabetes", epsilon = 1.0 } = req.body || {};

    const budget = getBudgetForKey(apiKey);

    if (!budget.canRunQuery(epsilon)) {
      return res.status(403).json({
        error: "privacy_budget_exhausted",
        remaining: budget.getRemainingBudget()
      });
    }

    const data = JSON.parse(fs.readFileSync("data/patients_encrypted.json","utf8"));

    const trueCount = countPlainEncrypted(data, { ageMin, ageMax, condition });
    const noisyCount = addDifferentialPrivacy(trueCount, epsilon);

    budget.recordQuery(epsilon, { ageMin, ageMax, condition });

    return res.json({
      query: { ageMin, ageMax, condition },
      trueCount,
      noisyCount,
      budgetRemaining: budget.getRemainingBudget(),
      message: "Laplace noise added. DP-protected response."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// GET /budget/<apiKey>
app.get("/budget/:key", (req, res) => {
  const key = req.params.key || "demo";
  const budget = getBudgetForKey(key);
  res.json({
    remaining: budget.getRemainingBudget(),
    history: budget.getHistory()
  });
});

// Start API on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
