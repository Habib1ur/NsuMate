import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export default async function DashboardPage() {
  const auth = getCurrentUserFromRequest();
  if (!auth) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) return null;

  const filledFields = [
    user.bio,
    user.interests.length > 0,
    user.religion,
    user.familyInfo,
    user.heightCm,
    user.hometown,
    user.currentCity,
    user.profilePhotoUrl
  ].filter(Boolean).length;
  const completeness = Math.min(100, 40 + filledFields * 7);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hi {user.name.split(" ")[0]},</h1>
          <p className="text-sm text-slate-600">Here is your academic and profile summary.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Profile completeness</p>
          <p className="text-xl font-semibold text-primary-700">{completeness}%</p>
        </div>
      </div>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-sm font-medium text-slate-800 mb-3">Academic summary</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-slate-500">Department</p>
            <p className="font-semibold">{user.department}</p>
          </div>
          <div>
            <p className="text-slate-500">Batch / Graduation year</p>
            <p className="font-semibold">{user.batchYear}</p>
          </div>
          <div>
            <p className="text-slate-500">Semester</p>
            <p className="font-semibold">
              {user.semester} (#{user.semesterNumber})
            </p>
          </div>
          <div>
            <p className="text-slate-500">University year</p>
            <p className="font-semibold">{user.universityYear}</p>
          </div>
          <div>
            <p className="text-slate-500">CGPA</p>
            <p className="font-semibold">{user.cgpa.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-500">Credit completed</p>
            <p className="font-semibold">{user.creditCompleted ?? "-"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

