import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.string(),
  dob: z.string(),
  department: z.string(),
  batchYear: z.string(),
  semester: z.string(),
  semesterNumber: z.string(),
  universityYear: z.string(),
  studentId: z.string().optional().or(z.literal("")),
  cgpa: z.string()
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const body = parsed.data;
  const cgpa = parseFloat(body.cgpa);
  if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
    return NextResponse.json(
      { error: "CGPA must be between 0.0 and 4.0" },
      { status: 400 }
    );
  }

  try {
    const { token } = await registerUser({
      name: body.name,
      email: body.email,
      password: body.password,
      gender: body.gender,
      dob: new Date(body.dob),
      department: body.department,
      batchYear: parseInt(body.batchYear, 10),
      semester: body.semester,
      semesterNumber: parseInt(body.semesterNumber, 10),
      universityYear: parseInt(body.universityYear, 10),
      studentId: body.studentId || undefined,
      cgpa
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set("nsumate_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/"
    });
    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 400 }
    );
  }
}

