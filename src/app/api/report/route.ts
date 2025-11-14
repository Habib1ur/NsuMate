import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.reportedId || !body.reason) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      reporterId: auth.userId,
      reportedId: body.reportedId,
      reason: body.reason
    }
  });

  return NextResponse.json({ report });
}

