import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.redirect(new URL("/login", req.url));

  const me = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!me || me.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");
  if (!id || !action) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (action === "resolve") {
    await prisma.report.update({
      where: { id },
      data: { status: "RESOLVED", resolvedAt: new Date() }
    });
  } else if (action === "ban") {
    await prisma.report.update({
      where: { id },
      data: { status: "RESOLVED", resolvedAt: new Date() }
    });
    await prisma.user.update({
      where: { id: report.reportedId },
      data: { isBanned: true }
    });
  }

  return NextResponse.redirect(new URL("/admin", req.url));
}

