import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";
import { ProfileCard } from "@/components/ProfileCard";

export default async function BrowsePage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const auth = getCurrentUserFromRequest();
  if (!auth) return null;

  const filters: any = { isApproved: true, isBanned: false };
  if (searchParams.gender) filters.gender = searchParams.gender;
  if (searchParams.department) filters.department = searchParams.department;
  if (searchParams.semester) filters.semester = searchParams.semester;
  if (searchParams.universityYear) filters.universityYear = Number(searchParams.universityYear);
  if (searchParams.batchYear) filters.batchYear = Number(searchParams.batchYear);

  const users = await prisma.user.findMany({
    where: {
      ...filters,
      id: { not: auth.userId }
    },
    orderBy: { createdAt: "desc" },
    take: 30
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Browse profiles</h1>
      <p className="text-xs text-slate-600">
        Use filters (gender, department, CGPA, semester, year) via query params; this page shows most
        recent profiles.
      </p>
      <div className="grid gap-4">
        {users.map((u) => (
          <ProfileCard key={u.id} user={u} showCgpa />
        ))}
      </div>
    </div>
  );
}

