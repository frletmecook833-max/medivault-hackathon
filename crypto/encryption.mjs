import crypto from "crypto";

const SECRET = "SUPER_SECRET_KEY_DONT_SHARE";

function xorString(str, key) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

export function encryptValue(value) {
  const json = JSON.stringify(value);
  const xored = xorString(json, SECRET);
  const hash = crypto.createHash("sha256").update(xored).digest("hex");
  return Buffer.from(xored).toString("base64") + "." + hash;
}

export function decryptValue(ciphertext) {
  const [base, hash] = ciphertext.split(".");
  const xored = Buffer.from(base, "base64").toString();

  const verify = crypto.createHash("sha256").update(xored).digest("hex");
  if (verify !== hash) throw new Error("Integrity check failed!");

  const json = xorString(xored, SECRET);
  return JSON.parse(json);
}
