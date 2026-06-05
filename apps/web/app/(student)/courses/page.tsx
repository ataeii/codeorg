import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import CourseCard from "@/components/curriculum/CourseCard";
import { getTranslations } from "next-intl/server";

export default async function CoursesPage() {
  const t = await getTranslations();
  const session = await auth();

  const courses = await db.course.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { lessons: true } } },
  });

  const progressMap: Record<string, number> = {};

  if (session?.user?.id) {
    const completedProgress = await db.progress.findMany({
      where: { userId: session.user.id, completed: true },
      include: { lesson: { select: { courseId: true } } },
    });

    for (const course of courses) {
      const total = course._count.lessons;
      const completed = completedProgress.filter(
        (p) => p.lesson.courseId === course.id
      ).length;
      progressMap[course.id] = total > 0 ? Math.round((completed / total) * 100) : 0;
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {t("courses.title")}
      </h1>

      {courses.length === 0 ? (
        <p className="text-gray-500 text-center py-20">دوره‌ای یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progressMap[course.id] ?? 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
