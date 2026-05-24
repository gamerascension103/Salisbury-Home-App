import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { completions } from "@/lib/db/schema";
import { getSessionTokenFromCookie, getSessionUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getSessionTokenFromCookie();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getSessionUser(token);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const rows = await db
    .select()
    .from(completions)
    .where(eq(completions.id, id))
    .limit(1);

  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const completion = rows[0];
  if (completion.user_id !== userId) {
    return NextResponse.json(
      { error: "Cannot undo another user's completion" },
      { status: 403 }
    );
  }

  await db.delete(completions).where(eq(completions.id, id));
  return NextResponse.json({ ok: true });
}
