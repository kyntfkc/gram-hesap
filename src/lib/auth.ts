import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "gram_hesap_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

export type SessionUser = {
  email: string;
  name: string;
};

type AuthUser = SessionUser & {
  password: string;
};

function getSecretKey(): Uint8Array | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export function parseAuthUsers(): AuthUser[] {
  const raw = process.env.AUTH_USERS ?? "";
  return raw
    .split(/[,\n]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [emailRaw, password = "", nameRaw] = line.split(":");
      const email = emailRaw?.trim().toLowerCase() ?? "";
      const name = (nameRaw?.trim() || emailRaw?.trim() || email).trim();
      return { email, password, name };
    })
    .filter((user) => user.email && user.password);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  const key = getSecretKey();
  if (!key) throw new Error("AUTH_SECRET tanımlı değil");

  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  const key = getSecretKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    if (
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }
    return { email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function sessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
