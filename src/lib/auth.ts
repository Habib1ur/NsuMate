import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthTokenPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export async function registerUser(params: {
  name: string;
  email: string;
  password: string;
  gender: string;
  dob: Date;
  department: string;
  batchYear: number;
  semester: string;
  semesterNumber: number;
  universityYear: number;
  studentId?: string;
  cgpa: number;
}): Promise<{ token: string }> {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(params.password, 10);

  const user = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email.toLowerCase(),
      passwordHash,
      gender: params.gender,
      dob: params.dob,
      department: params.department,
      batchYear: params.batchYear,
      semester: params.semester,
      semesterNumber: params.semesterNumber,
      universityYear: params.universityYear,
      studentId: params.studentId,
      cgpa: params.cgpa
    }
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role } as AuthTokenPayload,
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
}

export async function authenticateUser(email: string, password: string): Promise<{ token: string }> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  if (user.isBanned) {
    throw new Error("Account banned");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role } as AuthTokenPayload,
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token };
}

export function verifyToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  return decoded;
}
