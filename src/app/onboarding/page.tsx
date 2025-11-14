"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

type Step = 1 | 2 | 3 | 4 | 5;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = (step / 5) * 100;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body: any = {};
    form.forEach((v, k) => (body[k] = v));

    try {
      const res = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save profile");
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Complete your profile</h1>
      <p className="text-sm text-slate-600 mb-4">
        We use this information to calculate academic compatibility.
      </p>
      <div className="mb-6">
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-primary-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Profile completeness: {Math.round(progress)}%
        </p>
      </div>

      <form onSubmit={step === 5 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-slate-800">Step 1: Basic info</h2>
            <Input name="bio" label="Short bio" placeholder="Tell others about yourself" />
            <Input name="hometown" label="Hometown" />
            <Input name="currentCity" label="Current city" />
            <Input name="heightCm" type="number" label="Height (cm)" />
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-slate-800">Step 2: Academic info</h2>
            <Input name="semester" label="Semester" placeholder="e.g., Spring 2025" />
            <Input name="semesterNumber" type="number" label="Current semester number" />
            <Input name="universityYear" type="number" label="University year (1-5)" />
            <Input name="studentId" label="Student ID (optional)" />
            <Input name="creditCompleted" type="number" label="Credit completed (optional)" />
            <Input name="cgpa" type="number" step="0.01" min="0" max="4" label="CGPA" />
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-slate-800">Step 3: Personal & family</h2>
            <Input name="religion" label="Religion (optional)" />
            <Input name="familyInfo" label="Family information" />
            <Input name="interests" label="Interests (comma separated)" />
          </section>
        )}

        {step === 4 && (
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-slate-800">Step 4: Preferences</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input name="prefMinAge" type="number" label="Preferred min age" />
              <Input name="prefMaxAge" type="number" label="Preferred max age" />
            </div>
            <Input name="prefDepartment" label="Preferred department (optional)" />
            <div className="grid grid-cols-2 gap-4">
              <Input name="prefMinCgpa" type="number" step="0.01" label="Preferred min CGPA" />
              <Input name="prefMaxCgpa" type="number" step="0.01" label="Preferred max CGPA" />
            </div>
            <div className="space-y-2">
              <Checkbox
                name="prefSameDepartment"
                label="Prefer partner from same department"
                defaultChecked
              />
              <Checkbox
                name="prefSimilarCgpa"
                label="Prefer similar CGPA range"
                defaultChecked
              />
              <Checkbox
                name="prefSameSemesterOrYear"
                label="Prefer same semester / year"
                defaultChecked
              />
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-slate-800">Step 5: Privacy & photo</h2>
            <Input
              name="profilePhotoUrl"
              label="Profile photo URL (use image hosting or CDN)"
            />
            <div className="space-y-2">
              <Checkbox
                name="showFullName"
                label="Show full name on profile"
                defaultChecked
              />
              <Checkbox name="blurPhoto" label="Blur profile photo by default" />
              <Checkbox name="hideCGPA" label="Hide CGPA from profile" />
            </div>
          </section>
        )}

        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 1}
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
          >
            Back
          </Button>
          {step < 5 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => (s < 5 ? ((s + 1) as Step) : s))}
            >
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Finish onboarding"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

