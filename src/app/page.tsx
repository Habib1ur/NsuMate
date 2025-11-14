import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 flex flex-col items-center text-center gap-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-xs font-medium text-primary-700">
        Academic-first matrimony exclusively for NSU students
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Find your academically compatible partner at NSU.
      </h1>
      <p className="max-w-2xl text-sm text-slate-600">
        NsuMate uses CGPA, semester, department, and your academic preferences to recommend
        potential partners from within your university community. Verified via university email only.
      </p>
      <div className="flex gap-4">
        <Link href="/register">
          <Button>Get started</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">Log in</Button>
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 text-left text-xs text-slate-600">
        <div className="rounded-lg border bg-white p-4">
          <p className="font-semibold text-slate-900 mb-1">Academic matching</p>
          <p>Match on semester, CGPA range, department, and year with transparent academic badges.</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="font-semibold text-slate-900 mb-1">Private by design</p>
          <p>Control visibility of your full name, CGPA, and profile photo with privacy toggles.</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="font-semibold text-slate-900 mb-1">Admin oversight</p>
          <p>Admins review profiles, track suspicious academic data, and handle reports and bans.</p>
        </div>
      </div>
    </div>
  );
}

