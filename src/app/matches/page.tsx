import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth-helpers";

export default async function MatchesPage() {
  const auth = getCurrentUserFromRequest();
  if (!auth) return null;

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ initiatorId: auth.userId }, { receiverId: auth.userId }],
      isMutual: true
    },
    include: {
      initiator: true,
      receiver: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Your matches</h1>
      {matches.length === 0 && <p className="text-sm text-slate-600">No mutual matches yet.</p>}
      <div className="space-y-3">
        {matches.map((m) => {
          const other = m.initiatorId === auth.userId ? m.receiver : m.initiator;
          return (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg border bg-white p-3 text-sm"
            >
              <div>
                <p className="font-medium">{other.name}</p>
                <p className="text-xs text-slate-500">
                  {other.department} • {other.semester} • CGPA {other.cgpa.toFixed(2)}
                </p>
              </div>
              <a
                href={`/messages/${m.id}`}
                className="rounded-md bg-primary-600 px-3 py-1 text-xs font-medium text-white"
              >
                Open chat
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

