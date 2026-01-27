import crypto from "crypto";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";

function getEncryptionKey() {
  const secret =
    process.env.ADMIN_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    process.env.APP_SECRET;
  if (!secret) {
    return null;
  }
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptSecret(value: string) {
  const key = getEncryptionKey();
  if (!key) {
    throw new Error("Missing ADMIN_ENCRYPTION_KEY (or NEXTAUTH_SECRET/APP_SECRET).");
  }
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64")
  ].join(".");
}

export function decryptSecret(payload: string) {
  const key = getEncryptionKey();
  if (!key) {
    throw new Error("Missing ADMIN_ENCRYPTION_KEY (or NEXTAUTH_SECRET/APP_SECRET).");
  }
  const [ivB64, tagB64, encryptedB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !encryptedB64) {
    throw new Error("Invalid encrypted payload.");
  }
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
