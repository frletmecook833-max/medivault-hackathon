import SEAL from "node-seal";

(async () => {
  try {
    const seal = await SEAL();
    console.log("SEAL loaded!");
  } catch (e) {
    console.error("SEAL init failed:", e);
    process.exit(1);
  }
})();
