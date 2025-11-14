import Image from "next/image";
import { User } from "@prisma/client";

type Props = {
  user: User;
  showCgpa: boolean;
};

export function ProfileCard({ user, showCgpa }: Props) {
  const age = Math.floor(
    (Date.now() - new Date(user.dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );

  const displayName = user.showFullName ? user.name : user.name.split(" ")[0];

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex gap-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-slate-200">
        {user.profilePhotoUrl && (
          <Image
            src={user.profilePhotoUrl}
            alt={displayName}
            fill
            className={user.blurPhoto ? "object-cover blur-sm" : "object-cover"}
          />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">
              {displayName}, {age}
            </p>
            <p className="text-xs text-slate-500">
              {user.department} • Batch {user.batchYear}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 text-[10px]">
            <span className="rounded-full bg-primary-50 px-2 py-1 text-primary-700">
              {user.semester} • Year {user.universityYear}
            </span>
            {showCgpa && !user.hideCGPA && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                CGPA {user.cgpa.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2">{user.bio}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
            Academic Match
          </span>
        </div>
      </div>
    </div>
  );
}

