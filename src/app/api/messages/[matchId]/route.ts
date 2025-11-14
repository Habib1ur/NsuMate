import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

async function ensureNoBlock(userId: string, otherId: string) {
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: otherId },
        { blockerId: otherId, blockedId: userId }
      ]
    }
  });
  return !block;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const match = await prisma.match.findUnique({
    where: { id: params.matchId },
    include: { initiator: true, receiver: true }
  });
  if (
    !match ||
    !match.isMutual ||
    (match.initiatorId !== auth.userId && match.receiverId !== auth.userId)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const otherId =
    match.initiatorId === auth.userId ? match.receiverId : match.initiatorId;
  const allowed = await ensureNoBlock(auth.userId, otherId);
  if (!allowed) {
    return NextResponse.json({ error: "Blocked" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { matchId: params.matchId },
    orderBy: { createdAt: "asc" }
  });

  await prisma.message.updateMany({
    where: { matchId: params.matchId, senderId: { not: auth.userId } },
    data: { isRead: true }
  });

  return NextResponse.json({ messages });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { matchId: string } }
) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const match = await prisma.match.findUnique({
    where: { id: params.matchId }
  });
  if (
    !match ||
    !match.isMutual ||
    (match.initiatorId !== auth.userId && match.receiverId !== auth.userId)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const otherId =
    match.initiatorId === auth.userId ? match.receiverId : match.initiatorId;
  const allowed = await ensureNoBlock(auth.userId, otherId);
  if (!allowed) {
    return NextResponse.json({ error: "Blocked" }, { status: 403 });
  }

  const body = await req.json();
  if (!body.content || typeof body.content !== "string") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      matchId: params.matchId,
      senderId: auth.userId,
      content: body.content
    }
  });

  return NextResponse.json({ message });
}

