import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const progress = await db.progress.findMany({
    where: { userId: session.user.id },
    include: {
      lesson: {
        select: { title: true, courseId: true, id: true },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  const certificates = await db.certificate.findMany({
    where: { userId: session.user.id },
    include: { course: { select: { title: true } } },
  });

  const completed = progress.filter((p) => p.completed);
  const total = progress.length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">پیشرفت من</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-blue-600">{completed.length}</div>
          <div className="text-sm text-gray-500 mt-1">درس‌های تکمیل شده</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-gray-700">{total}</div>
          <div className="text-sm text-gray-500 mt-1">کل درس‌های شروع شده</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="text-3xl font-bold text-yellow-500">{certificates.length}</div>
          <div className="text-sm text-gray-500 mt-1">گواهینامه‌ها</div>
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">گواهینامه‌ها</h2>
          <div className="space-y-2">
            {certificates.map((cert) => (
              <div
                key={`${cert.userId}-${cert.courseId}`}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="font-medium text-gray-800">🏆 {cert.course.title}</span>
                <span className="text-xs text-gray-400">
                  {new Date(cert.issuedAt).toLocaleDateString("fa-IR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-700 mb-3">درس‌های اخیر</h2>
      <div className="space-y-2">
        {progress.map((p) => (
          <Link
            key={`${p.userId}-${p.lessonId}`}
            href={`/lessons/${p.lesson.id}`}
            className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:border-blue-200 transition"
          >
            <span className="text-sm font-medium text-gray-700">{p.lesson.title}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {p.attempts} تلاش
              </span>
              {p.completed ? (
                <span className="text-xs text-green-600 font-medium">✓ تکمیل</span>
              ) : (
                <span className="text-xs text-blue-500 font-medium">در حال یادگیری</span>
              )}
            </div>
          </Link>
        ))}
        {progress.length === 0 && (
          <p className="text-gray-400 text-center py-12">
            هنوز هیچ درسی شروع نکرده‌ای.{" "}
            <Link href="/courses" className="text-blue-500 underline">
              شروع کن!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
