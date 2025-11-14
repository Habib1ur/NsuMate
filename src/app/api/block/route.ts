import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.blockedId) {
    return NextResponse.json({ error: "Missing blockedId" }, { status: 400 });
  }

  const block = await prisma.block.upsert({
    where: {
      blockerId_blockedId: {
        blockerId: auth.userId,
        blockedId: body.blockedId
      }
    },
    create: { blockerId: auth.userId, blockedId: body.blockedId },
    update: {}
  });

  return NextResponse.json({ block });
}

