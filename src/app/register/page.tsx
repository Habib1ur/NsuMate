"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const body: any = {};
    form.forEach((v, k) => (body[k] = v));

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Registration failed");
      }
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Create your NsuMate account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Input name="name" label="Full name" required />
        <Select name="gender" label="Gender" required defaultValue="">
          <option value="" disabled>
            Select gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Input name="dob" type="date" label="Date of birth" required />
        <Input name="email" type="email" label="University email" required />
        <Input name="department" label="Department / Major" required />
        <Input name="batchYear" type="number" label="Batch / Graduation year" required />
        <Input name="semester" label="Semester (e.g., Spring 2025)" required />
        <Input name="semesterNumber" type="number" label="Current semester number" required />
        <Input name="universityYear" type="number" label="University year (1-5)" required />
        <Input name="studentId" label="Student ID (optional)" />
        <Input name="cgpa" type="number" step="0.01" min="0" max="4" label="CGPA" required />
        <Input name="password" type="password" label="Password" required />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}

