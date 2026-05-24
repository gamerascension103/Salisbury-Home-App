import { NextRequest, NextResponse } from "next/server";
import {
  getSessionTokenFromCookie,
  deleteSession,
  clearSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = await getSessionTokenFromCookie();
  if (token) {
    await deleteSession(token);
  }
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
