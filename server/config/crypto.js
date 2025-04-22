import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Encryption key (must be 32 bytes for AES-256)
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || "X7kP9mWqT2rY5vL8nJ3zB6cF4dH0eA1").trim();
const key = Buffer.alloc(32);

if (key.length !== 32) {
  throw new Error(`Key setup failed: got ${key.length} bytes (expected 32)`);
}

Buffer.from(ENCRYPTION_KEY).copy(key);
const IV_LENGTH = 16;

// Encrypt function
export function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

// Decrypt function
export function decrypt(encryptedText) {
  if (!encryptedText.includes(":")) {
    throw new Error("Encrypted text is in an invalid format (missing IV).");
  }

  const [ivHex, encrypted] = encryptedText.split(":");

  if (ivHex.length !== 32) {
    throw new Error("Invalid IV length");
  }

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}


export function safeDecrypt(text) {
  try {
    return decrypt(text);
  } catch (err) {
    // console.warn("Decryption failed, returning raw text:", err.message);
    return text;
  }
}
