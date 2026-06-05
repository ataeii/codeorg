import Link from "next/link";
import { useTranslations } from "next-intl";
import Navbar from "@/components/curriculum/Navbar";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">💻</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("home.hero")}
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          {t("home.heroSub")}
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
          >
            {t("home.startLearning")}
          </Link>
          <Link
            href="/courses"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-50 transition"
          >
            {t("home.featuredCourses")}
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-right">
          {[
            { icon: "🎯", title: "یادگیری بصری", desc: "با بلاک‌های رنگارنگ بدون نوشتن کد شروع کن" },
            { icon: "📚", title: "محتوای فارسی", desc: "تمام دوره‌ها به زبان فارسی و متناسب با برنامه درسی ایران" },
            { icon: "🏆", title: "گواهینامه", desc: "با تکمیل هر دوره گواهینامه رسمی دریافت کن" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
