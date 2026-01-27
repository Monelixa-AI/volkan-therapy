import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const SESSION_COOKIE_NAME = "vt_admin_session";
const SESSION_TTL_DAYS = 14;
const SESSION_REMEMBER_TTL_DAYS = 30;
const PBKDF2_ITERATIONS = 120000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";

type PasswordHashPayload = {
  iterations: number;
  salt: string;
  hash: string;
};

function formatPasswordHash(payload: PasswordHashPayload) {
  return `pbkdf2$${payload.iterations}$${payload.salt}$${payload.hash}`;
}

function parsePasswordHash(value: string): PasswordHashPayload | null {
  const [scheme, iterations, salt, hash] = value.split("$");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) {
    return null;
  }
  const parsedIterations = Number(iterations);
  if (!Number.isFinite(parsedIterations) || parsedIterations <= 0) {
    return null;
  }
  return { iterations: parsedIterations, salt, hash };
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex");
  return formatPasswordHash({
    iterations: PBKDF2_ITERATIONS,
    salt,
    hash
  });
}

export function verifyPassword(password: string, storedHash: string) {
  const parsed = parsePasswordHash(storedHash);
  if (!parsed) {
    return false;
  }
  const hash = crypto
    .pbkdf2Sync(password, parsed.salt, parsed.iterations, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString("hex");
  const hashBuffer = Buffer.from(hash, "hex");
  const storedBuffer = Buffer.from(parsed.hash, "hex");
  if (hashBuffer.length !== storedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(hashBuffer, storedBuffer);
}

function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getSessionCookie() {
  return cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
}

function setSessionCookie(token: string, expiresAt: Date) {
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/"
  });
}

function clearSessionCookie() {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/"
  });
}

export async function createAdminSession(adminId: string, rememberMe = false) {
  const token = createSessionToken();
  const ttlDays = rememberMe ? SESSION_REMEMBER_TTL_DAYS : SESSION_TTL_DAYS;
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  await prisma.adminSession.create({
    data: {
      adminId,
      token,
      expiresAt
    }
  });
  setSessionCookie(token, expiresAt);
  return token;
}

export async function getAdminFromSession() {
  const token = getSessionCookie();
  if (!token) {
    return null;
  }
  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true }
  });
  if (!session) {
    return null;
  }
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => undefined);
    clearSessionCookie();
    return null;
  }
  return session.admin;
}

export async function requireAdmin() {
  const admin = await getAdminFromSession();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}

export async function destroyAdminSession() {
  const token = getSessionCookie();
  if (token) {
    await prisma.adminSession.delete({ where: { token } }).catch(() => undefined);
  }
  clearSessionCookie();
}
