import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const course = await db.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const progressMap: Record<string, boolean> = {};
  if (session?.user?.id) {
    const progresses = await db.progress.findMany({
      where: { userId: session.user.id, lesson: { courseId: course.id } },
    });
    for (const p of progresses) {
      progressMap[p.lessonId] = p.completed;
    }
  }

  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const totalCount = course.lessons.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h1>
        <p className="text-gray-500 mb-4">{course.description}</p>

        {totalCount > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{completedCount} از {totalCount} درس</span>
              <span>{Math.round((completedCount / totalCount) * 100)}٪</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {course.lessons.map((lesson, index) => {
          const done = progressMap[lesson.id] ?? false;
          const prevDone = index === 0 || progressMap[course.lessons[index - 1].id];
          const locked = !session?.user && index > 0;

          return (
            <Link
              key={lesson.id}
              href={session?.user ? `/lessons/${lesson.id}` : "/login"}
              className={`flex items-center gap-4 bg-white rounded-xl p-4 border transition ${
                done
                  ? "border-green-200 bg-green-50"
                  : locked
                  ? "border-gray-100 opacity-60 cursor-not-allowed"
                  : "border-gray-100 hover:border-blue-200"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  done
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {done ? "✓" : index + 1}
              </div>
              <span className="font-medium text-gray-800">{lesson.title}</span>
              {!session?.user && (
                <span className="mr-auto text-xs text-gray-400">🔒 ورود کنید</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
