import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Course } from "@prisma/client";

interface CourseCardProps {
  course: Course & { _count: { lessons: number } };
  progress?: number;
}

const DIFFICULTY_COLORS = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-yellow-100 text-yellow-700",
  ADVANCED: "bg-red-100 text-red-700",
};

const DIFFICULTY_LABELS = {
  BEGINNER: "مبتدی",
  INTERMEDIATE: "متوسط",
  ADVANCED: "پیشرفته",
};

export default function CourseCard({ course, progress = 0 }: CourseCardProps) {
  const t = useTranslations();
  const completed = progress >= 100;

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all p-6 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${DIFFICULTY_COLORS[course.difficulty]}`}
          >
            {DIFFICULTY_LABELS[course.difficulty]}
          </span>
          <span className="text-xs text-gray-400">
            پایه {course.gradeMin}–{course.gradeMax}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{course._count.lessons} {t("courses.lessons")}</span>
          {completed && (
            <span className="text-green-600 font-medium">✓ {t("courses.completed")}</span>
          )}
        </div>

        {progress > 0 && (
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}

        <div className="mt-4">
          <span className="inline-block w-full text-center bg-blue-600 text-white text-sm font-medium py-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            {progress > 0 ? t("courses.continueCourse") : t("courses.startCourse")}
          </span>
        </div>
      </div>
    </Link>
  );
}
