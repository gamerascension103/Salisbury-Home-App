import { cookies } from "next/headers";
import { db } from "./db";
import { sessions } from "./db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, timingSafeEqual } from "crypto";

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 90 * 24 * 60 * 60 * 1000;


export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.HOUSEHOLD_PASSWORD;
  if (!expected) return false;
  try {
    const a = Buffer.from(input.padEnd(64, "\0"));
    const b = Buffer.from(expected.padEnd(64, "\0"));
    return timingSafeEqual(a, b) && input === expected;
  } catch {
    return false;
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  const now = Date.now();
  await db.insert(sessions).values({
    id: token,
    user_id: userId,
    created_at: now,
    expires_at: now + SESSION_DURATION_MS,
  });
  return token;
}

export async function getSessionUser(
  token: string
): Promise<string | null> {
  const now = Date.now();
  const rows = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, token))
    .limit(1);
  if (!rows.length) return null;
  const session = rows[0];
  if (session.expires_at < now) {
    await db.delete(sessions).where(eq(sessions.id, token));
    return null;
  }
  await db
    .update(sessions)
    .set({ expires_at: now + SESSION_DURATION_MS })
    .where(eq(sessions.id, token));
  return session.user_id;
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, token));
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}
