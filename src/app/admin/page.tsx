import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

// Server-side admin dashboard.
// Accessible only if the logged-in user has role ADMIN.
export default async function AdminDashboardPage() {
  const auth = getCurrentUserFromRequest();
  if (!auth) {
    return null;
  }

  const me = await prisma.user.findUnique({
    where: { id: auth.userId }
  });

  if (!me || me.role !== "ADMIN") {
    return null;
  }

  const [pendingProfiles, reports] = await Promise.all([
    prisma.user.findMany({
      where: { isApproved: false, isBanned: false }
    }),
    prisma.report.findMany({
      where: { status: "PENDING" },
      include: { reporter: true, reported: true }
    })
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-sm font-medium mb-3">Pending profile approvals</h2>
        <div className="space-y-2 text-xs">
          {pendingProfiles.length === 0 ? (
            <p className="text-slate-500">No pending profiles.</p>
          ) : (
            pendingProfiles.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b py-2 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p className="text-slate-500">
                    {user.email} • {user.department} • {user.semester} • CGPA{" "}
                    {user.cgpa.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/api/admin/approve-user?id=${user.id}&action=approve`}
                    className="rounded-md bg-emerald-600 px-2 py-1 text-[10px] text-white"
                  >
                    Approve
                  </a>
                  <a
                    href={`/api/admin/approve-user?id=${user.id}&action=reject`}
                    className="rounded-md bg-red-600 px-2 py-1 text-[10px] text-white"
                  >
                    Reject
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-sm font-medium mb-3">User reports</h2>
        <div className="space-y-2 text-xs">
          {reports.length === 0 ? (
            <p className="text-slate-500">No pending reports.</p>
          ) : (
            reports.map((report: any) => (
              <div
                key={report.id}
                className="flex items-center justify-between border-b py-2 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {report.reporter.name} → {report.reported.name}
                  </p>
                  <p className="text-slate-500">{report.reason}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/api/admin/report?id=${report.id}&action=resolve`}
                    className="rounded-md bg-emerald-600 px-2 py-1 text-[10px] text-white"
                  >
                    Mark resolved
                  </a>
                  <a
                    href={`/api/admin/report?id=${report.id}&action=ban`}
                    className="rounded-md bg-red-600 px-2 py-1 text-[10px] text-white"
                  >
                    Ban user
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
