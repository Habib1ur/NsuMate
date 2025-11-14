import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const where: any = {
    isApproved: true,
    isBanned: false,
    id: { not: auth.userId }
  };

  const gender = searchParams.get("gender");
  const department = searchParams.get("department");
  const semester = searchParams.get("semester");
  const universityYear = searchParams.get("universityYear");
  const batchYear = searchParams.get("batchYear");
  const minCgpa = searchParams.get("minCgpa");
  const maxCgpa = searchParams.get("maxCgpa");
  const religion = searchParams.get("religion");

  if (gender) where.gender = gender;
  if (department) where.department = department;
  if (semester) where.semester = semester;
  if (universityYear) where.universityYear = Number(universityYear);
  if (batchYear) where.batchYear = Number(batchYear);
  if (religion) where.religion = religion;
  if (minCgpa || maxCgpa) {
    where.cgpa = {};
    if (minCgpa) where.cgpa.gte = Number(minCgpa);
    if (maxCgpa) where.cgpa.lte = Number(maxCgpa);
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return NextResponse.json({ users });
}

