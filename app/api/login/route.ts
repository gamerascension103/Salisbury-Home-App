import { NextRequest, NextResponse } from "next/server";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id, password } = body as {
    user_id: string;
    password: string;
  };

  if (!["jake", "hannah"].includes(user_id)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = await createSession(user_id);
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
