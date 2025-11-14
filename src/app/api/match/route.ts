import { NextRequest, NextResponse } from "next/server";
import { ensureMatchBetween } from "@/lib/matching";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.otherUserId) {
    return NextResponse.json({ error: "Missing otherUserId" }, { status: 400 });
  }

  const match = await ensureMatchBetween(auth.userId, body.otherUserId);
  return NextResponse.json({ match });
}

