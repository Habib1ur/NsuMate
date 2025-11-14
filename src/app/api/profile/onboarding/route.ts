import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const data: any = {};
  if (body.bio !== undefined) data.bio = body.bio;
  if (body.hometown !== undefined) data.hometown = body.hometown;
  if (body.currentCity !== undefined) data.currentCity = body.currentCity;
  if (body.heightCm !== undefined && body.heightCm !== "")
    data.heightCm = Number(body.heightCm);

  if (body.semester !== undefined && body.semester !== "")
    data.semester = body.semester;
  if (body.semesterNumber !== undefined && body.semesterNumber !== "")
    data.semesterNumber = Number(body.semesterNumber);
  if (body.universityYear !== undefined && body.universityYear !== "")
    data.universityYear = Number(body.universityYear);
  if (body.studentId !== undefined && body.studentId !== "")
    data.studentId = body.studentId;
  if (body.creditCompleted !== undefined && body.creditCompleted !== "")
    data.creditCompleted = Number(body.creditCompleted);
  if (body.cgpa !== undefined && body.cgpa !== "") {
    const cgpa = Number(body.cgpa);
    if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
      return NextResponse.json(
        { error: "CGPA must be between 0.0 and 4.0" },
        { status: 400 }
      );
    }
    data.cgpa = cgpa;
  }

  if (body.religion !== undefined) data.religion = body.religion;
  if (body.familyInfo !== undefined) data.familyInfo = body.familyInfo;
  if (body.interests !== undefined) {
    data.interests = body.interests
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
  }

  if (body.prefMinAge !== undefined && body.prefMinAge !== "")
    data.prefMinAge = Number(body.prefMinAge);
  if (body.prefMaxAge !== undefined && body.prefMaxAge !== "")
    data.prefMaxAge = Number(body.prefMaxAge);
  if (body.prefDepartment !== undefined)
    data.prefDepartment = body.prefDepartment;
  if (body.prefMinCgpa !== undefined && body.prefMinCgpa !== "")
    data.prefMinCgpa = Number(body.prefMinCgpa);
  if (body.prefMaxCgpa !== undefined && body.prefMaxCgpa !== "")
    data.prefMaxCgpa = Number(body.prefMaxCgpa);

  data.prefSameDepartment = body.prefSameDepartment === "on";
  data.prefSimilarCgpa = body.prefSimilarCgpa === "on";
  data.prefSameSemesterOrYear = body.prefSameSemesterOrYear === "on";

  if (body.profilePhotoUrl !== undefined)
    data.profilePhotoUrl = body.profilePhotoUrl;
  data.showFullName = body.showFullName === "on";
  data.blurPhoto = body.blurPhoto === "on";
  data.hideCGPA = body.hideCGPA === "on";

  await prisma.user.update({
    where: { id: auth.userId },
    data
  });

  return NextResponse.json({ success: true });
}

